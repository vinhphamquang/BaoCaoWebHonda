/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: API quản lý xe
 */

const express = require('express');
const { body, query } = require('express-validator');
const {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  getFeaturedCars,
  searchCars,
  getCarsByType,
  uploadCarImages
} = require('../controllers/cars');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createCarValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên xe phải từ 2-100 ký tự'),
  body('type')
    .isIn(['sedan', 'suv', 'electric'])
    .withMessage('Loại xe không hợp lệ'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Giá xe phải là số dương'),
  body('year')
    .isInt({ min: 2020, max: new Date().getFullYear() + 1 })
    .withMessage('Năm sản xuất không hợp lệ'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Mô tả phải từ 10-1000 ký tự'),
  body('specifications.engine')
    .notEmpty()
    .withMessage('Thông tin động cơ không được để trống'),
  body('specifications.power')
    .notEmpty()
    .withMessage('Công suất không được để trống'),
  body('specifications.seating')
    .isInt({ min: 2, max: 9 })
    .withMessage('Số chỗ ngồi phải từ 2-9')
];

const updateCarValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Tên xe phải từ 2-100 ký tự'),
  body('type')
    .optional()
    .isIn(['sedan', 'suv', 'electric'])
    .withMessage('Loại xe không hợp lệ'),
  body('price')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Giá xe phải là số dương'),
  body('year')
    .optional()
    .isInt({ min: 2020, max: new Date().getFullYear() + 1 })
    .withMessage('Năm sản xuất không hợp lệ')
];

const searchValidation = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Từ khóa tìm kiếm phải từ 1-100 ký tự'),
  query('type')
    .optional()
    .isIn(['sedan', 'suv', 'electric'])
    .withMessage('Loại xe không hợp lệ'),
  query('minPrice')
    .optional()
    .isNumeric()
    .withMessage('Giá tối thiểu phải là số'),
  query('maxPrice')
    .optional()
    .isNumeric()
    .withMessage('Giá tối đa phải là số'),
  query('year')
    .optional()
    .isInt({ min: 2020 })
    .withMessage('Năm sản xuất không hợp lệ'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Trang phải là số dương'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Giới hạn phải từ 1-50')
];

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Lấy danh sách xe
 *     tags: [Cars]
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
 *         description: Số lượng xe mỗi trang
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [sedan, suv, electric]
 *         description: Loại xe
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Năm sản xuất
 *     responses:
 *       200:
 *         description: Danh sách xe
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
 *                         $ref: '#/components/schemas/Car'
 */

/**
 * @swagger
 * /api/cars/featured:
 *   get:
 *     summary: Lấy danh sách xe nổi bật
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Danh sách xe nổi bật
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
 *                         $ref: '#/components/schemas/Car'
 */

/**
 * @swagger
 * /api/cars/{id}:
 *   get:
 *     summary: Lấy chi tiết xe
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của xe
 *     responses:
 *       200:
 *         description: Chi tiết xe
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Car'
 *       404:
 *         description: Không tìm thấy xe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Public routes
router.get('/', searchValidation, getCars);
router.get('/featured', getFeaturedCars);
router.get('/search', searchValidation, searchCars);
router.get('/type/:type', getCarsByType);
router.get('/:id', optionalAuth, getCar);

/**
 * @swagger
 * /api/cars:
 *   post:
 *     summary: Tạo xe mới (Admin only)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - price
 *               - year
 *               - description
 *               - specifications
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "VinFast VF 9"
 *               type:
 *                 type: string
 *                 enum: [sedan, suv, electric]
 *                 example: "electric"
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 example: 1500000000
 *               year:
 *                 type: integer
 *                 minimum: 2020
 *                 example: 2024
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: "VinFast VF 9 là mẫu SUV điện cao cấp..."
 *               specifications:
 *                 type: object
 *                 required:
 *                   - engine
 *                   - power
 *                   - seating
 *                 properties:
 *                   engine:
 *                     type: string
 *                     example: "Động cơ điện"
 *                   power:
 *                     type: string
 *                     example: "408 HP"
 *                   seating:
 *                     type: integer
 *                     minimum: 2
 *                     maximum: 9
 *                     example: 7
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     alt:
 *                       type: string
 *                     isPrimary:
 *                       type: boolean
 *               isFeatured:
 *                 type: boolean
 *                 example: true
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *     responses:
 *       201:
 *         description: Tạo xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Car'
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
 *       403:
 *         description: Không có quyền admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/cars/{id}:
 *   put:
 *     summary: Cập nhật xe (Admin only)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của xe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               type:
 *                 type: string
 *                 enum: [sedan, suv, electric]
 *               price:
 *                 type: number
 *                 minimum: 0
 *               year:
 *                 type: integer
 *                 minimum: 2020
 *               description:
 *                 type: string
 *               isFeatured:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Cập nhật xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Car'
 *       404:
 *         description: Không tìm thấy xe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Xóa xe (Admin only)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của xe
 *     responses:
 *       200:
 *         description: Xóa xe thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       404:
 *         description: Không tìm thấy xe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createCarValidation, createCar);
router.put('/:id', protect, authorize('admin'), updateCarValidation, updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);
router.post('/:id/images', protect, authorize('admin'), uploadCarImages);

module.exports = router;
