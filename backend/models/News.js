const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Vui lòng nhập tiêu đề'],
    trim: true,
    maxlength: [200, 'Tiêu đề không được quá 200 ký tự']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Vui lòng nhập tóm tắt'],
    maxlength: [500, 'Tóm tắt không được quá 500 ký tự']
  },
  content: {
    type: String,
    required: [true, 'Vui lòng nhập nội dung']
  },
  featuredImage: {
    url: {
      type: String,
      required: [true, 'Vui lòng chọn ảnh đại diện']
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    }
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Bài viết phải có tác giả']
  },
  category: {
    type: String,
    required: [true, 'Vui lòng chọn danh mục'],
    enum: ['product', 'technology', 'business', 'event', 'announcement', 'review']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title không được quá 60 ký tự']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description không được quá 160 ký tự']
    },
    keywords: [String],
    canonicalUrl: String
  },
  readingTime: {
    type: Number,
    default: 0
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Bình luận không được quá 1000 ký tự']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (slug already has unique: true, so no need for separate index)
newsSchema.index({ title: 'text', excerpt: 'text', content: 'text' });
newsSchema.index({ status: 1 });
newsSchema.index({ category: 1 });
newsSchema.index({ featured: -1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ views: -1 });
newsSchema.index({ author: 1 });
newsSchema.index({ tags: 1 });

// Virtual for category display
newsSchema.virtual('categoryDisplay').get(function() {
  const categoryMap = {
    product: 'Sản phẩm',
    technology: 'Công nghệ',
    business: 'Kinh doanh',
    event: 'Sự kiện',
    announcement: 'Thông báo',
    review: 'Đánh giá'
  };
  return categoryMap[this.category] || this.category;
});

// Virtual for approved comments count
newsSchema.virtual('approvedCommentsCount').get(function() {
  return this.comments.filter(comment => comment.status === 'approved').length;
});

// Virtual for formatted published date
newsSchema.virtual('formattedPublishedDate').get(function() {
  if (this.publishedAt) {
    return this.publishedAt.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  return null;
});

// Create slug before saving
newsSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Calculate reading time before saving
newsSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Set published date when status changes to published
newsSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Auto-generate SEO fields if not provided
newsSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('excerpt')) {
    if (!this.seo.metaTitle) {
      this.seo.metaTitle = this.title.substring(0, 60);
    }
    if (!this.seo.metaDescription) {
      this.seo.metaDescription = this.excerpt.substring(0, 160);
    }
  }
  next();
});

// Static method to get published posts
newsSchema.statics.getPublished = function(options = {}) {
  const { page = 1, limit = 10, category, featured, tags } = options;
  const query = { status: 'published' };
  
  if (category) {
    query.category = category;
  }
  
  if (featured !== undefined) {
    query.featured = featured;
  }
  
  if (tags && tags.length > 0) {
    query.tags = { $in: tags };
  }
  
  return this.find(query)
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to search posts
newsSchema.statics.searchPosts = function(query, options = {}) {
  const { page = 1, limit = 10, category } = options;
  const searchQuery = { 
    status: 'published',
    $text: { $search: query }
  };
  
  if (category) {
    searchQuery.category = category;
  }
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .populate('author', 'name avatar')
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit * 1)
    .skip((page - 1) * limit);
};

// Static method to get related posts
newsSchema.statics.getRelated = function(postId, category, tags, limit = 5) {
  return this.find({
    _id: { $ne: postId },
    status: 'published',
    $or: [
      { category: category },
      { tags: { $in: tags } }
    ]
  })
  .populate('author', 'name avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Instance method to increment views
newsSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Instance method to add comment
newsSchema.methods.addComment = function(commentData) {
  this.comments.push(commentData);
  return this.save();
};

module.exports = mongoose.model('News', newsSchema);
