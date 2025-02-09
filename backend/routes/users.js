const express = require('express');
const { getCurrentUser } = require('../controllers/users');
const { validateUser } = require('../middleware/validators');
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
router.post('/signup', validateUser, createUser);
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
