const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @route   GET /api/bookings
// @desc    Get all bookings for current user (or all bookings if admin)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // If not admin, filter bookings
    if (req.user.role === 'client') {
      query.user = req.user.id;
    } else if (req.user.role === 'staff') {
      query.assignedHelper = req.user.id;
    }

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone avatar')
      .populate('assignedHelper', 'name email phone avatar');

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('assignedHelper', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post(
  '/',
  protect,
  [
    body('service').trim().notEmpty().withMessage('Service name is required'),
    body('serviceId').isInt().withMessage('Service ID must be a number'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 hour'),
    body('address').trim().notEmpty().withMessage('Address is required'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const {
        service,
        serviceId,
        date,
        time,
        duration,
        address,
        specialInstructions = '',
        paymentMethod = 'qr',
        assignedHelper = null,
        helperName = '',
      } = req.body;

      let finalAssignedHelper = assignedHelper;
      let finalHelperName = helperName;
      let initialStatus = 'pending_admin';

      // Auto-assign provider if not selected
      if (!finalAssignedHelper) {
        const potentialProviders = await User.find({
          role: 'staff',
          servicesOffered: serviceId
        });

        if (potentialProviders.length > 0) {
          // Simple random assignment for now
          const randomProvider = potentialProviders[Math.floor(Math.random() * potentialProviders.length)];
          finalAssignedHelper = randomProvider._id;
          finalHelperName = randomProvider.name;
          // Even if auto-assigned, it still needs admin approval first
          initialStatus = 'pending_admin';
        }
      }

      // Calculate total amount (basic pricing logic)
      const basePrices = {
        1: 500, // House Help
        2: 800, // Childcare
        3: 1000, // Elderly Care
        4: 400, // Pet Care
      };
      const basePrice = basePrices[serviceId] || 500;
      const totalAmount = (basePrice / 4) * duration; // Assuming base price is for 4 hours

      const booking = await Booking.create({
        user: req.user.id,
        service,
        serviceId,
        date: new Date(date),
        time,
        duration,
        address,
        specialInstructions,
        paymentMethod,
        totalAmount,
        status: initialStatus,
        assignedHelper: finalAssignedHelper,
        helperName: finalHelperName,
      });

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        booking,
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Staff/Admin)
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Allow admin or assigned helper
    if (
      req.user.role !== 'admin' &&
      (req.user.role !== 'staff' || booking.assignedHelper?.toString() !== req.user.id)
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking status' });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/approve-admin
// @desc    Admin approves the booking (transitions to pending_provider)
// @access  Private/Admin
router.put('/:id/approve-admin', protect, authorize('admin'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status !== 'pending_admin') {
      return res.status(400).json({ success: false, message: 'Booking is not pending admin approval' });
    }

    if (!booking.assignedHelper) {
      return res.status(400).json({ success: false, message: 'Please assign a helper before approving' });
    }

    booking.status = 'pending_provider';
    await booking.save();

    res.json({ success: true, message: 'Booking approved by admin', booking });
  } catch (error) {
    console.error('Admin approve error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/respond-provider
// @desc    Provider accepts or rejects the booking
// @access  Private/Staff
router.put('/:id/respond-provider', protect, authorize('staff'), async (req, res) => {
  try {
    const { response } = req.body; // 'accept' or 'reject'
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.assignedHelper.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status !== 'pending_provider') {
      return res.status(400).json({ success: false, message: 'Booking is not pending provider acceptance' });
    }

    if (response === 'accept') {
      booking.status = 'confirmed';
    } else if (response === 'reject') {
      booking.status = 'rejected';
      // Optional: Remove assignment so admin can re-assign?
      // For now, keep it simple, just mark rejected.
    } else {
      return res.status(400).json({ success: false, message: 'Invalid response' });
    }

    await booking.save();
    res.json({ success: true, message: `Booking ${response}ed`, booking });
  } catch (error) {
    console.error('Provider respond error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update a booking
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking',
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete a booking
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Make sure user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this booking',
      });
    }

    await booking.deleteOne();

    res.json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   PUT /api/bookings/:id/assign-helper
// @desc    Assign a helper to a booking (Admin only)
// @access  Private/Admin
router.put('/:id/assign-helper', protect, authorize('admin'), async (req, res) => {
  try {
    const { helperId, helperName } = req.body;

    if (!helperId && !helperName) {
      return res.status(400).json({
        success: false,
        message: 'Helper ID or name is required',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // If helperId provided, verify helper exists
    if (helperId) {
      const helper = await User.findById(helperId);
      if (!helper || helper.role !== 'staff') {
        return res.status(400).json({
          success: false,
          message: 'Invalid helper ID or helper is not a staff member',
        });
      }
      booking.assignedHelper = helperId;
      booking.helperName = helper.name;
    } else {
      booking.helperName = helperName;
    }

    // Update status to pending_provider (waiting for provider acceptance) when helper is assigned
    if (booking.status === 'pending_admin') {
      booking.status = 'pending_provider';
    }

    await booking.save();

    const updatedBooking = await Booking.findById(req.params.id)
      .populate('assignedHelper', 'name email phone')
      .populate('user', 'name email phone');

    res.json({
      success: true,
      message: 'Helper assigned successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Assign helper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   PUT /api/bookings/:id/rating
// @desc    Add rating and review to a completed booking
// @access  Private
router.put(
  '/:id/rating',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      // Only booking owner can add rating
      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to rate this booking',
        });
      }

      // Only allow rating for completed bookings
      if (booking.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Can only rate completed bookings',
        });
      }

      booking.rating = req.body.rating;
      booking.review = req.body.review || '';

      await booking.save();

      res.json({
        success: true,
        message: 'Rating added successfully',
        booking,
      });
    } catch (error) {
      console.error('Add rating error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// @route   GET /api/bookings/provider/:providerId/reviews
// @desc    Get all reviews for a specific provider
// @access  Public
router.get('/provider/:providerId/reviews', async (req, res) => {
  try {
    const reviews = await Booking.find({
      assignedHelper: req.params.providerId,
      status: 'completed',
      rating: { $exists: true, $ne: null }
    })
      .select('rating review user createdAt')
      .populate('user', 'name avatar') // Assuming user has name and avatar
      .sort({ createdAt: -1 });

    // Calculate average rating
    const stats = await Booking.aggregate([
      {
        $match: {
          assignedHelper: new mongoose.Types.ObjectId(req.params.providerId),
          status: 'completed',
          rating: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      reviews,
      stats: stats[0] || { averageRating: 0, totalReviews: 0 }
    });
  } catch (error) {
    console.error('Get provider reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   PUT /api/bookings/:id/client-rating
// @desc    Add rating and review for a client (Provider only)
// @access  Private
router.put(
  '/:id/client-rating',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      // Only assigned helper can rate the client
      if (booking.assignedHelper.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to rate this client',
        });
      }

      // Only allow rating for completed bookings
      if (booking.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Can only rate completed bookings',
        });
      }

      booking.clientRating = req.body.rating;
      booking.clientReview = req.body.review || '';

      await booking.save();

      res.json({
        success: true,
        message: 'Client rating added successfully',
        booking,
      });
    } catch (error) {
      console.error('Add client rating error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

module.exports = router;
