const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['customer', 'agent', 'admin'], required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintCode: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['billing', 'technical', 'delivery', 'account', 'other'],
      default: 'other',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    attachments: [{ type: String }], // store file URLs/paths
    status: {
      type: String,
      enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    messages: [messageSchema],
    resolutionNotes: { type: String, default: '' },
    resolvedAt: { type: Date, default: null },
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comments: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Generate a human-friendly complaint code before saving new documents
complaintSchema.pre('validate', function (next) {
  if (!this.complaintCode) {
    const rand = Math.floor(100000 + Math.random() * 900000);
    this.complaintCode = `CMP-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
