const express = require('express');
const { body, query } = require('express-validator');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải từ 2-100 ký tự'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
  body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Vai trò không hợp lệ')
];

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải từ 2-100 ký tự'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('phone')
    .optional()
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Vai trò không hợp lệ'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('Trạng thái hoạt động phải là boolean'),
  body('address')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Địa chỉ không được quá 200 ký tự')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Trang phải là số dương'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Giới hạn phải từ 1-50'),
  query('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Vai trò không hợp lệ'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('Trạng thái hoạt động phải là boolean'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Từ khóa tìm kiếm phải từ 1-100 ký tự')
];

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/', queryValidation, getUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUser);
router.post('/', createUserValidation, createUser);
router.put('/:id', updateUserValidation, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
