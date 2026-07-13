const Complaint = require('../models/Complaint');
const User = require('../models/User');

// POST /api/complaints  (customer)
exports.createComplaint = async (req, res) => {
  try {
    const { subject, description, category, priority, attachments } = req.body;
    if (!subject || !description) {
      return res.status(400).json({ message: 'Subject and description are required' });
    }

    const complaint = await Complaint.create({
      customer: req.user._id,
      subject,
      description,
      category,
      priority,
      attachments: attachments || [],
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaintId: complaint.complaintCode,
      complaint,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit complaint', error: err.message });
  }
};

// GET /api/complaints  - role-aware listing
// customer -> only their own complaints
// agent    -> complaints assigned to them
// admin    -> all complaints (optionally filter by ?status=)
exports.listComplaints = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === 'customer') {
      filter.customer = req.user._id;
    } else if (req.user.role === 'agent') {
      filter.assignedAgent = req.user._id;
    }
    if (req.query.status) filter.status = req.query.status;

    const complaints = await Complaint.find(filter)
      .populate('customer', 'name email phone')
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
};

// GET /api/complaints/:id
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('assignedAgent', 'name email')
      .populate('messages.sender', 'name role');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Access control: customers can only view their own; agents only assigned ones
    const isOwner = String(complaint.customer._id) === String(req.user._id);
    const isAssignedAgent =
      complaint.assignedAgent && String(complaint.assignedAgent._id) === String(req.user._id);

    if (req.user.role === 'customer' && !isOwner) {
      return res.status(403).json({ message: 'You cannot view this complaint' });
    }
    if (req.user.role === 'agent' && !isAssignedAgent) {
      return res.status(403).json({ message: 'This complaint is not assigned to you' });
    }

    res.json({ complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaint', error: err.message });
  }
};

// PUT /api/complaints/:id/assign  (admin only)
exports.assignComplaint = async (req, res) => {
  try {
    const { agentId } = req.body;
    if (!agentId) return res.status(400).json({ message: 'agentId is required' });

    const agent = await User.findOne({ _id: agentId, role: 'agent' });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedAgent: agent._id,
        assignedBy: req.user._id,
        status: 'assigned',
      },
      { new: true }
    ).populate('assignedAgent', 'name email');

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    res.json({ message: `Complaint assigned to ${agent.name}`, complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign complaint', error: err.message });
  }
};

// PUT /api/complaints/:id/status  (agent/admin) - update status + resolution notes
exports.updateStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const allowed = ['open', 'assigned', 'in_progress', 'resolved', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (
      req.user.role === 'agent' &&
      (!complaint.assignedAgent || String(complaint.assignedAgent) !== String(req.user._id))
    ) {
      return res.status(403).json({ message: 'This complaint is not assigned to you' });
    }

    complaint.status = status;
    if (resolutionNotes !== undefined) complaint.resolutionNotes = resolutionNotes;
    if (status === 'resolved') complaint.resolvedAt = new Date();

    await complaint.save();
    res.json({ message: 'Complaint status updated', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// POST /api/complaints/:id/messages  - customer/agent/admin chat on a complaint
exports.addMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    const isOwner = String(complaint.customer) === String(req.user._id);
    const isAssignedAgent =
      complaint.assignedAgent && String(complaint.assignedAgent) === String(req.user._id);

    if (req.user.role === 'customer' && !isOwner) {
      return res.status(403).json({ message: 'You cannot message on this complaint' });
    }
    if (req.user.role === 'agent' && !isAssignedAgent) {
      return res.status(403).json({ message: 'This complaint is not assigned to you' });
    }

    complaint.messages.push({
      sender: req.user._id,
      senderRole: req.user.role,
      text: text.trim(),
    });

    await complaint.save();
    res.status(201).json({ message: 'Message sent', messages: complaint.messages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

// POST /api/complaints/:id/feedback  (customer only, after resolution)
exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comments } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    if (String(complaint.customer) !== String(req.user._id)) {
      return res.status(403).json({ message: 'You can only give feedback on your own complaints' });
    }
    if (!['resolved', 'closed'].includes(complaint.status)) {
      return res.status(400).json({ message: 'Feedback can only be given after resolution' });
    }

    complaint.feedback = { rating, comments: comments || '', submittedAt: new Date() };
    complaint.status = 'closed';
    await complaint.save();

    res.json({ message: 'Thank you for your feedback', complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit feedback', error: err.message });
  }
};

// GET /api/complaints/stats/overview (admin) - simple analytics for trend insight
exports.getStats = async (req, res) => {
  try {
    const [byStatus, byCategory, avgRatingAgg, totalComplaints] = await Promise.all([
      Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Complaint.aggregate([
        { $match: { 'feedback.rating': { $ne: null } } },
        { $group: { _id: null, avgRating: { $avg: '$feedback.rating' } } },
      ]),
      Complaint.countDocuments(),
    ]);

    res.json({
      totalComplaints,
      byStatus,
      byCategory,
      averageRating: avgRatingAgg[0] ? Number(avgRatingAgg[0].avgRating.toFixed(2)) : null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
};
