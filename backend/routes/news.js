const express = require('express');
const { body, query } = require('express-validator');
const {
  getNews,
  getNewsArticle,
  createNews,
  updateNews,
  deleteNews,
  getFeaturedNews,
  searchNews,
  getNewsByCategory,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/news');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const createNewsValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Tiêu đề phải từ 5-200 ký tự'),
  body('excerpt')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Tóm tắt phải từ 10-500 ký tự'),
  body('content')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Nội dung phải có ít nhất 50 ký tự'),
  body('category')
    .isIn(['product', 'technology', 'business', 'event', 'announcement', 'review'])
    .withMessage('Danh mục không hợp lệ'),
  body('featuredImage.url')
    .isURL()
    .withMessage('URL ảnh đại diện không hợp lệ'),
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

const updateNewsValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Tiêu đề phải từ 5-200 ký tự'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Tóm tắt phải từ 10-500 ký tự'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage('Nội dung phải có ít nhất 50 ký tự'),
  body('category')
    .optional()
    .isIn(['product', 'technology', 'business', 'event', 'announcement', 'review'])
    .withMessage('Danh mục không hợp lệ'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ')
];

const commentValidation = [
  body('content')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Bình luận phải từ 5-1000 ký tự')
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
  query('category')
    .optional()
    .isIn(['product', 'technology', 'business', 'event', 'announcement', 'review'])
    .withMessage('Danh mục không hợp lệ'),
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived'])
    .withMessage('Trạng thái không hợp lệ'),
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured phải là boolean')
];

const searchValidation = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Từ khóa tìm kiếm phải từ 1-100 ký tự'),
  query('category')
    .optional()
    .isIn(['product', 'technology', 'business', 'event', 'announcement', 'review'])
    .withMessage('Danh mục không hợp lệ'),
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
 * /api/news:
 *   get:
 *     summary: Lấy danh sách tin tức
 *     tags: [News]
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
 *         description: Số lượng tin tức mỗi trang
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [product, technology, business, event, announcement, review]
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Lọc tin tức nổi bật
 *     responses:
 *       200:
 *         description: Danh sách tin tức
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
 *                         $ref: '#/components/schemas/News'
 */

/**
 * @swagger
 * /api/news/featured:
 *   get:
 *     summary: Lấy danh sách tin tức nổi bật
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Số lượng tin tức
 *     responses:
 *       200:
 *         description: Danh sách tin tức nổi bật
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
 *                         $ref: '#/components/schemas/News'
 */

/**
 * @swagger
 * /api/news/search:
 *   get:
 *     summary: Tìm kiếm tin tức
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Từ khóa tìm kiếm
 *         example: "VinFast"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [product, technology, business, event, announcement, review]
 *         description: Lọc theo danh mục
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
 *         description: Số lượng tin tức mỗi trang
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
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
 *                         $ref: '#/components/schemas/News'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/news/{slug}:
 *   get:
 *     summary: Lấy chi tiết tin tức
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Slug của tin tức
 *         example: "vinfast-vf-3-chinh-thuc-ra-mat"
 *     responses:
 *       200:
 *         description: Chi tiết tin tức
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/News'
 *                         - type: object
 *                           properties:
 *                             relatedPosts:
 *                               type: array
 *                               items:
 *                                 $ref: '#/components/schemas/News'
 *       404:
 *         description: Không tìm thấy tin tức
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Public routes
router.get('/', queryValidation, getNews);
router.get('/featured', getFeaturedNews);
router.get('/search', searchValidation, searchNews);
router.get('/category/:category', getNewsByCategory);
router.get('/:slug', optionalAuth, getNewsArticle);

// Comment routes
router.post('/:id/comments', optionalAuth, commentValidation, addComment);
router.put('/:id/comments/:commentId', protect, commentValidation, updateComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

// Admin routes
router.post('/', protect, authorize('admin'), createNewsValidation, createNews);
router.put('/:id', protect, authorize('admin'), updateNewsValidation, updateNews);
router.delete('/:id', protect, authorize('admin'), deleteNews);

module.exports = router;
