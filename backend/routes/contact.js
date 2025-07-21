const express = require('express');
const { body, query } = require('express-validator');
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  respondToContact,
  getContactStats
} = require('../controllers/contact');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createContactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải từ 2-100 ký tự'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('subject')
    .isIn(['product-inquiry', 'test-drive', 'purchase', 'service', 'warranty', 'other'])
    .withMessage('Chủ đề không hợp lệ'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Tin nhắn phải từ 10-2000 ký tự')
];

const updateContactValidation = [
  body('status')
    .optional()
    .isIn(['new', 'in_progress', 'resolved', 'closed'])
    .withMessage('Trạng thái không hợp lệ'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Mức độ ưu tiên không hợp lệ'),
  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('ID người được giao không hợp lệ'),
  body('followUpDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Ngày theo dõi không hợp lệ'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags phải là mảng'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Tag phải từ 1-50 ký tự')
];

const respondValidation = [
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Phản hồi phải từ 10-2000 ký tự')
];

const addNoteValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Ghi chú phải từ 1-1000 ký tự')
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
  query('status')
    .optional()
    .isIn(['new', 'in_progress', 'resolved', 'closed'])
    .withMessage('Trạng thái không hợp lệ'),
  query('subject')
    .optional()
    .isIn(['product-inquiry', 'test-drive', 'purchase', 'service', 'warranty', 'other'])
    .withMessage('Chủ đề không hợp lệ'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Mức độ ưu tiên không hợp lệ'),
  query('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('ID người được giao không hợp lệ')
];

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Gửi liên hệ tư vấn
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Nguyễn Văn A"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "customer@example.com"
 *               phone:
 *                 type: string
 *                 pattern: "^[0-9]{10,11}$"
 *                 example: "0123456789"
 *               subject:
 *                 type: string
 *                 enum: [product-inquiry, test-drive, purchase, service, warranty, other]
 *                 description: Chủ đề liên hệ
 *                 example: "product-inquiry"
 *               message:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *                 description: Nội dung tin nhắn
 *                 example: "Tôi muốn tư vấn về xe VinFast VF 8"
 *     responses:
 *       201:
 *         description: Gửi liên hệ thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất."
 *                     data:
 *                       $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Public routes
router.post('/', createContactValidation, createContact);

// Admin routes
router.get('/', protect, authorize('admin'), queryValidation, getContacts);
router.get('/:id', protect, authorize('admin'), getContact);
router.put('/:id', protect, authorize('admin'), updateContactValidation, updateContact);
router.delete('/:id', protect, authorize('admin'), deleteContact);
router.post('/:id/respond', protect, authorize('admin'), respondValidation, respondToContact);
router.post('/:id/notes', protect, authorize('admin'), addNoteValidation, updateContact);
router.get('/stats/overview', protect, authorize('admin'), getContactStats);

module.exports = router;
