const { validationResult } = require('express-validator');
const News = require('../models/News');

// @desc    Get all news
// @route   GET /api/news
// @access  Public
exports.getNews = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const options = {
      page,
      limit,
      category: req.query.category,
      featured: req.query.featured
    };

    if (req.query.tags) {
      options.tags = req.query.tags.split(',');
    }

    const news = await News.getPublished(options);
    const total = await News.countDocuments({ status: 'published' });

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single news article
// @route   GET /api/news/:slug
// @access  Public
exports.getNewsArticle = async (req, res, next) => {
  try {
    const news = await News.findOne({ slug: req.params.slug, status: 'published' })
      .populate('author', 'name avatar')
      .populate('relatedPosts', 'title slug excerpt featuredImage publishedAt');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    // Increment views
    await news.incrementViews();

    // Get related posts if not already populated
    if (!news.relatedPosts || news.relatedPosts.length === 0) {
      const relatedPosts = await News.getRelated(news._id, news.category, news.tags, 5);
      news.relatedPosts = relatedPosts;
    }

    res.status(200).json({
      success: true,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create news article
// @route   POST /api/news
// @access  Private/Admin
exports.createNews = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const newsData = {
      ...req.body,
      author: req.user.id
    };

    const news = await News.create(newsData);
    await news.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Tạo bài viết thành công',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private/Admin
exports.updateNews = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'name avatar');

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật bài viết thành công',
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
exports.deleteNews = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    await news.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa bài viết thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured news
// @route   GET /api/news/featured
// @access  Public
exports.getFeaturedNews = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5;

    const news = await News.getPublished({ featured: true, limit });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search news
// @route   GET /api/news/search
// @access  Public
exports.searchNews = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const options = {
      page,
      limit,
      category: req.query.category
    };

    const news = await News.searchPosts(req.query.q, options);

    res.status(200).json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get news by category
// @route   GET /api/news/category/:category
// @access  Public
exports.getNewsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const news = await News.getPublished({ category, page, limit });
    const total = await News.countDocuments({ category, status: 'published' });

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      data: news
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to news
// @route   POST /api/news/:id/comments
// @access  Public (with optional auth)
exports.addComment = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    const commentData = {
      content: req.body.content,
      user: req.user ? req.user.id : null,
      name: req.user ? req.user.name : req.body.name,
      email: req.user ? req.user.email : req.body.email
    };

    await news.addComment(commentData);

    res.status(201).json({
      success: true,
      message: 'Thêm bình luận thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update comment
// @route   PUT /api/news/:id/comments/:commentId
// @access  Private (Owner or Admin)
exports.updateComment = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors.array()
      });
    }

    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    const comment = news.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình luận'
      });
    }

    // Check if user owns comment or is admin
    const isOwner = comment.user && comment.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật bình luận này'
      });
    }

    comment.content = req.body.content;
    await news.save();

    res.status(200).json({
      success: true,
      message: 'Cập nhật bình luận thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/news/:id/comments/:commentId
// @access  Private (Owner or Admin)
exports.deleteComment = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết'
      });
    }

    const comment = news.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình luận'
      });
    }

    // Check if user owns comment or is admin
    const isOwner = comment.user && comment.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa bình luận này'
      });
    }

    comment.deleteOne();
    await news.save();

    res.status(200).json({
      success: true,
      message: 'Xóa bình luận thành công'
    });
  } catch (error) {
    next(error);
  }
};
