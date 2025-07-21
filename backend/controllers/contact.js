const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
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
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    }

    // Execute query
    const contacts = await Contact.find(query)
      .populate('assignedTo', 'name email')
      .populate('response.respondedBy', 'name')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await Contact.countDocuments(query);

    // Pagination result
    const pagination = {};

    if (startIndex + limit < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pagination,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('response.respondedBy', 'name email')
      .populate('notes.addedBy', 'name');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new contact
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res, next) => {
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

    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Gửi liên hệ thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact
// @route   PUT /api/contact/:id
// @access  Private/Admin
exports.updateContact = async (req, res, next) => {
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

    // Handle adding notes
    if (req.body.content && req.path.includes('/notes')) {
      const contact = await Contact.findById(req.params.id);
      
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy liên hệ'
        });
      }

      contact.notes.push({
        content: req.body.content,
        addedBy: req.user.id
      });

      await contact.save();
      await contact.populate('notes.addedBy', 'name');

      return res.status(200).json({
        success: true,
        message: 'Thêm ghi chú thành công',
        data: contact
      });
    }

    // Regular update
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('assignedTo', 'name email')
     .populate('response.respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật liên hệ thành công',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ'
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa liên hệ thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Respond to contact
// @route   POST /api/contact/:id/respond
// @access  Private/Admin
exports.respondToContact = async (req, res, next) => {
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

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy liên hệ'
      });
    }

    // Update contact with response
    contact.response = {
      message: req.body.message,
      respondedBy: req.user.id,
      respondedAt: new Date()
    };

    // Update status if not already resolved
    if (contact.status === 'new') {
      contact.status = 'in_progress';
    }

    await contact.save();
    await contact.populate('response.respondedBy', 'name email');

    // In a real application, you would send an email to the customer here

    res.status(200).json({
      success: true,
      message: 'Phản hồi thành công',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats/overview
// @access  Private/Admin
exports.getContactStats = async (req, res, next) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const stats = await Contact.getStats(startDate, endDate);

    // Get overdue contacts
    const overdueContacts = await Contact.getOverdue();

    res.status(200).json({
      success: true,
      data: {
        stats,
        overdueCount: overdueContacts.length,
        overdue: overdueContacts
      }
    });
  } catch (error) {
    next(error);
  }
};
