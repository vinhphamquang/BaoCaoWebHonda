const express = require('express');
const { body, query } = require('express-validator');
const {
  getTestDrives,
  getTestDrive,
  createTestDrive,
  updateTestDrive,
  deleteTestDrive,
  getUserTestDrives,
  updateTestDriveStatus,
  getAvailableSlots,
  getTestDriveStats
} = require('../controllers/testDrive');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createTestDriveValidation = [
  body('car')
    .isMongoId()
    .withMessage('ID xe không hợp lệ'),
  body('customerInfo.fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Họ tên phải từ 2-100 ký tự'),
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email không hợp lệ'),
  body('customerInfo.phone')
    .matches(/^[0-9]{10,11}$/)
    .withMessage('Số điện thoại không hợp lệ'),
  body('schedule.preferredDate')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('Ngày lái thử phải là ngày trong tương lai');
      }
      return true;
    }),
  body('schedule.preferredTime')
    .isIn(['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'])
    .withMessage('Giờ lái thử không hợp lệ'),
  body('location')
    .isIn(['hanoi', 'hcm', 'danang', 'haiphong', 'cantho'])
    .withMessage('Địa điểm không hợp lệ'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Ghi chú không được quá 500 ký tự')
];

const updateTestDriveValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
    .withMessage('Trạng thái không hợp lệ'),
  body('schedule.confirmedDate')
    .optional()
    .isISO8601()
    .toDate(),
  body('schedule.confirmedTime')
    .optional()
    .isIn(['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'])
    .withMessage('Giờ xác nhận không hợp lệ'),
  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Ghi chú admin không được quá 1000 ký tự')
];

const feedbackValidation = [
  body('feedback.rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Đánh giá phải từ 1-5 sao'),
  body('feedback.comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Nhận xét không được quá 1000 ký tự')
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
    .isIn(['pending', 'confirmed', 'completed', 'cancelled', 'no_show'])
    .withMessage('Trạng thái không hợp lệ'),
  query('location')
    .optional()
    .isIn(['hanoi', 'hcm', 'danang', 'haiphong', 'cantho'])
    .withMessage('Địa điểm không hợp lệ')
];

const availableSlotsValidation = [
  query('date')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (value <= new Date()) {
        throw new Error('Ngày phải là ngày trong tương lai');
      }
      return true;
    }),
  query('location')
    .isIn(['hanoi', 'hcm', 'danang', 'haiphong', 'cantho'])
    .withMessage('Địa điểm không hợp lệ')
];

/**
 * @swagger
 * /api/test-drive:
 *   post:
 *     summary: Đăng ký lái thử xe
 *     tags: [Test Drive]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - car
 *               - customerInfo
 *               - schedule
 *               - location
 *             properties:
 *               car:
 *                 type: string
 *                 description: ID của xe muốn lái thử
 *                 example: "60d5ecb74b24a1234567890a"
 *               customerInfo:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - email
 *                   - phone
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 100
 *                     example: "Nguyễn Văn A"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "customer@example.com"
 *                   phone:
 *                     type: string
 *                     pattern: "^[0-9]{10,11}$"
 *                     example: "0123456789"
 *               schedule:
 *                 type: object
 *                 required:
 *                   - preferredDate
 *                   - preferredTime
 *                 properties:
 *                   preferredDate:
 *                     type: string
 *                     format: date
 *                     description: Ngày mong muốn (phải là ngày trong tương lai)
 *                     example: "2024-12-15"
 *                   preferredTime:
 *                     type: string
 *                     enum: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
 *                     example: "10:00"
 *               location:
 *                 type: string
 *                 enum: [hanoi, hcm, danang, haiphong, cantho]
 *                 description: Địa điểm lái thử
 *                 example: "hanoi"
 *               message:
 *                 type: string
 *                 maxLength: 500
 *                 description: Ghi chú (tùy chọn)
 *                 example: "Tôi muốn lái thử vào buổi sáng"
 *     responses:
 *       201:
 *         description: Đăng ký lái thử thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/TestDrive'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thời gian đã được đặt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/test-drive/available-slots:
 *   get:
 *     summary: Lấy danh sách slot thời gian trống
 *     tags: [Test Drive]
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày cần kiểm tra (phải là ngày trong tương lai)
 *         example: "2024-12-15"
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *           enum: [hanoi, hcm, danang, haiphong, cantho]
 *         description: Địa điểm lái thử
 *         example: "hanoi"
 *     responses:
 *       200:
 *         description: Danh sách slot trống
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: string
 *                         enum: ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
 *                       example: ['08:00', '09:00', '15:00', '16:00']
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Public routes
router.post('/', optionalAuth, createTestDriveValidation, createTestDrive);
router.get('/available-slots', availableSlotsValidation, getAvailableSlots);

// User routes
router.get('/my-test-drives', protect, getUserTestDrives);
router.get('/:id', protect, getTestDrive);
router.put('/:id/feedback', protect, feedbackValidation, updateTestDrive);

// Admin routes
router.get('/', protect, authorize('admin'), queryValidation, getTestDrives);
router.put('/:id', protect, authorize('admin'), updateTestDriveValidation, updateTestDrive);
router.delete('/:id', protect, authorize('admin'), deleteTestDrive);
router.patch('/:id/status', protect, authorize('admin'), updateTestDriveStatus);
router.get('/stats/overview', protect, authorize('admin'), getTestDriveStats);

module.exports = router;
