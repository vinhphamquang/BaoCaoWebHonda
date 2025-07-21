const { validationResult } = require('express-validator');
const TestDrive = require('../models/TestDrive');
const Car = require('../models/Car');

// @desc    Get all test drives
// @route   GET /api/test-drive
// @access  Private/Admin
exports.getTestDrives = async (req, res, next) => {
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
    const startIndex = (page - 1) * limit;

    // Build query
    let query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.location) {
      query.location = req.query.location;
    }

    // Execute query
    const testDrives = await TestDrive.find(query)
      .populate('user', 'name email phone')
      .populate('car', 'name images')
      .populate('assignedStaff', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await TestDrive.countDocuments(query);

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
      count: testDrives.length,
      total,
      pagination,
      data: testDrives
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single test drive
// @route   GET /api/test-drive/:id
// @access  Private
exports.getTestDrive = async (req, res, next) => {
  try {
    const testDrive = await TestDrive.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('car', 'name images specifications')
      .populate('assignedStaff', 'name email');

    if (!testDrive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch lái thử'
      });
    }

    // Check if user owns this test drive or is admin
    if (testDrive.user && testDrive.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập lịch lái thử này'
      });
    }

    res.status(200).json({
      success: true,
      data: testDrive
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new test drive
// @route   POST /api/test-drive
// @access  Public
exports.createTestDrive = async (req, res, next) => {
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

    // Verify car exists
    const car = await Car.findById(req.body.car);
    if (!car || !car.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Xe không tồn tại hoặc không còn hoạt động'
      });
    }

    // Check for scheduling conflicts
    const conflict = await TestDrive.checkConflict(
      req.body.schedule.preferredDate,
      req.body.schedule.preferredTime,
      req.body.location
    );

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Thời gian này đã được đặt, vui lòng chọn thời gian khác'
      });
    }

    // Create test drive
    const testDriveData = {
      ...req.body,
      user: req.user ? req.user.id : null
    };

    const testDrive = await TestDrive.create(testDriveData);

    // Populate the created test drive
    await testDrive.populate('car', 'name images');
    if (testDrive.user) {
      await testDrive.populate('user', 'name email phone');
    }

    res.status(201).json({
      success: true,
      message: 'Đăng ký lái thử thành công',
      data: testDrive
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update test drive
// @route   PUT /api/test-drive/:id
// @access  Private/Admin or Owner
exports.updateTestDrive = async (req, res, next) => {
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

    const testDrive = await TestDrive.findById(req.params.id);

    if (!testDrive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch lái thử'
      });
    }

    // Check permissions
    const isOwner = testDrive.user && testDrive.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật lịch lái thử này'
      });
    }

    // If updating schedule, check for conflicts
    if (req.body.schedule && (req.body.schedule.confirmedDate || req.body.schedule.confirmedTime)) {
      const conflict = await TestDrive.checkConflict(
        req.body.schedule.confirmedDate || testDrive.schedule.confirmedDate,
        req.body.schedule.confirmedTime || testDrive.schedule.confirmedTime,
        req.body.location || testDrive.location,
        testDrive._id
      );

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Thời gian này đã được đặt, vui lòng chọn thời gian khác'
        });
      }
    }

    // Update test drive
    Object.assign(testDrive, req.body);
    await testDrive.save();

    await testDrive.populate('user', 'name email phone');
    await testDrive.populate('car', 'name images');
    await testDrive.populate('assignedStaff', 'name email');

    res.status(200).json({
      success: true,
      message: 'Cập nhật lịch lái thử thành công',
      data: testDrive
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete test drive
// @route   DELETE /api/test-drive/:id
// @access  Private/Admin
exports.deleteTestDrive = async (req, res, next) => {
  try {
    const testDrive = await TestDrive.findById(req.params.id);

    if (!testDrive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch lái thử'
      });
    }

    await testDrive.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Xóa lịch lái thử thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user test drives
// @route   GET /api/test-drive/my-test-drives
// @access  Private
exports.getUserTestDrives = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const testDrives = await TestDrive.getByUser(req.user.id, { page, limit, status: req.query.status });
    const total = await TestDrive.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: testDrives.length,
      total,
      data: testDrives
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update test drive status
// @route   PATCH /api/test-drive/:id/status
// @access  Private/Admin
exports.updateTestDriveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const testDrive = await TestDrive.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone')
     .populate('car', 'name images')
     .populate('assignedStaff', 'name email');

    if (!testDrive) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch lái thử'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: testDrive
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available time slots
// @route   GET /api/test-drive/available-slots
// @access  Public
exports.getAvailableSlots = async (req, res, next) => {
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

    const { date, location } = req.query;

    const availableSlots = await TestDrive.getAvailableSlots(new Date(date), location);

    res.status(200).json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get test drive statistics
// @route   GET /api/test-drive/stats/overview
// @access  Private/Admin
exports.getTestDriveStats = async (req, res, next) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    const stats = await TestDrive.getStats(startDate, endDate);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
