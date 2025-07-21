/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API quản lý đơn hàng
 */

const express = require('express');
const { body, query } = require('express-validator');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),
  body('items.*.car')
    .isMongoId()
    .withMessage('ID xe không hợp lệ'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Số lượng phải là số dương'),
  body('items.*.selectedColor')
    .notEmpty()
    .withMessage('Vui lòng chọn màu xe'),
  body('items.*.depositAmount')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Số tiền đặt cọc phải là số dương'),
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
  body('customerInfo.address')
    .trim()
    .notEmpty()
    .withMessage('Địa chỉ không được để trống'),
  body('customerInfo.city')
    .notEmpty()
    .withMessage('Vui lòng chọn thành phố'),
  body('payment.method')
    .isIn(['bank_transfer', 'credit_card', 'cash'])
    .withMessage('Phương thức thanh toán không hợp lệ')
];

const updateOrderValidation = [
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'processing', 'completed', 'cancelled'])
    .withMessage('Trạng thái đơn hàng không hợp lệ'),
  body('payment.status')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Trạng thái thanh toán không hợp lệ')
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
    .isIn(['pending', 'confirmed', 'processing', 'completed', 'cancelled'])
    .withMessage('Trạng thái không hợp lệ'),
  query('paymentStatus')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'refunded'])
    .withMessage('Trạng thái thanh toán không hợp lệ')
];

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Lấy danh sách đơn hàng của user hiện tại
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Số lượng đơn hàng mỗi trang
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, completed, cancelled]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
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
 *                         $ref: '#/components/schemas/Order'
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - customerInfo
 *               - payment
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - car
 *                     - quantity
 *                     - selectedColor
 *                     - depositAmount
 *                   properties:
 *                     car:
 *                       type: string
 *                       description: ID của xe
 *                       example: "60d5ecb74b24a1234567890a"
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *                     selectedColor:
 *                       type: string
 *                       example: "Trắng"
 *                     depositAmount:
 *                       type: number
 *                       minimum: 0
 *                       example: 50000000
 *               customerInfo:
 *                 type: object
 *                 required:
 *                   - fullName
 *                   - email
 *                   - phone
 *                   - address
 *                   - city
 *                 properties:
 *                   fullName:
 *                     type: string
 *                     example: "Nguyễn Văn A"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "customer@example.com"
 *                   phone:
 *                     type: string
 *                     pattern: "^[0-9]{10,11}$"
 *                     example: "0123456789"
 *                   address:
 *                     type: string
 *                     example: "123 ABC Street"
 *                   city:
 *                     type: string
 *                     example: "Hà Nội"
 *               payment:
 *                 type: object
 *                 required:
 *                   - method
 *                 properties:
 *                   method:
 *                     type: string
 *                     enum: [bank_transfer, credit_card, cash]
 *                     example: "bank_transfer"
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Không có quyền truy cập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Chi tiết đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Order'
 *       404:
 *         description: Không tìm thấy đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Không có quyền truy cập đơn hàng này
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// User routes
router.get('/my-orders', protect, getUserOrders);
router.post('/', protect, createOrderValidation, createOrder);
router.get('/:id', protect, getOrder);

// Admin routes
router.get('/', protect, authorize('admin'), queryValidation, getOrders);
router.put('/:id', protect, authorize('admin'), updateOrderValidation, updateOrder);
router.delete('/:id', protect, authorize('admin'), deleteOrder);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.get('/stats/revenue', protect, authorize('admin'), getOrderStats);

module.exports = router;
