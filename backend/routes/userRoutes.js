const express = require('express');
const router = express.Router();
const {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin'), listUsers);
router.post('/', authorize('admin'), createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
