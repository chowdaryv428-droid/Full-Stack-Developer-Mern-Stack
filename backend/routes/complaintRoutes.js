const express = require('express');
const router = express.Router();
const {
  createComplaint,
  listComplaints,
  getComplaint,
  assignComplaint,
  updateStatus,
  addMessage,
  submitFeedback,
  getStats,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats/overview', authorize('admin'), getStats);

router.post('/', authorize('customer'), createComplaint);
router.get('/', listComplaints);
router.get('/:id', getComplaint);

router.put('/:id/assign', authorize('admin'), assignComplaint);
router.put('/:id/status', authorize('agent', 'admin'), updateStatus);
router.post('/:id/messages', addMessage);
router.post('/:id/feedback', authorize('customer'), submitFeedback);

module.exports = router;
