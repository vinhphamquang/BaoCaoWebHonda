const { validationResult } = require('express-validator');
const Car = require('../models/Car');

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
exports.getCars = async (req, res, next) => {
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
    let query = { isActive: true };

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = parseInt(req.query.maxPrice);
      }
    }

    // Filter by year
    if (req.query.year) {
      query.year = parseInt(req.query.year);
    }

    // Filter by electric
    if (req.query.isElectric !== undefined) {
      query.isElectric = req.query.isElectric === 'true';
    }

    // Sort
    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      sort = sortBy;
    } else {
      sort = '-createdAt';
    }

    // Execute query
    const cars = await Car.find(query)
      .sort(sort)
      .limit(limit)
      .skip(startIndex);

    // Get total count
    const total = await Car.countDocuments(query);

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
      count: cars.length,
      total,
      pagination,
      data: cars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe'
      });
    }

    if (!car.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Xe không còn hoạt động'
      });
    }

    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Private/Admin
exports.createCar = async (req, res, next) => {
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

    const car = await Car.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo xe thành công',
      data: car
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private/Admin
exports.updateCar = async (req, res, next) => {
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

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật xe thành công',
      data: car
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private/Admin
exports.deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe'
      });
    }

    // Soft delete by setting isActive to false
    car.isActive = false;
    await car.save();

    res.status(200).json({
      success: true,
      message: 'Xóa xe thành công'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured cars
// @route   GET /api/cars/featured
// @access  Public
exports.getFeaturedCars = async (req, res, next) => {
  try {
    const cars = await Car.getFeatured();

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search cars
// @route   GET /api/cars/search
// @access  Public
exports.searchCars = async (req, res, next) => {
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

    const filters = {};
    
    if (req.query.type) {
      filters.type = req.query.type;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) {
        filters.price.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filters.price.$lte = parseInt(req.query.maxPrice);
      }
    }

    const cars = await Car.searchCars(req.query.q, filters)
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cars by type
// @route   GET /api/cars/type/:type
// @access  Public
exports.getCarsByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const cars = await Car.find({ type, isActive: true })
      .sort('-createdAt')
      .limit(limit)
      .skip(startIndex);

    const total = await Car.countDocuments({ type, isActive: true });

    res.status(200).json({
      success: true,
      count: cars.length,
      total,
      data: cars
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload car images
// @route   POST /api/cars/:id/images
// @access  Private/Admin
exports.uploadCarImages = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy xe'
      });
    }

    // This is a placeholder for file upload functionality
    // In production, you would use multer or similar middleware
    
    res.status(200).json({
      success: true,
      message: 'Upload ảnh thành công'
    });
  } catch (error) {
    next(error);
  }
};
