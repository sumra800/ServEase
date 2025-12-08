const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @route   POST /api/payments/jazzcash
// @desc    Record JazzCash payment
// @access  Private
router.post(
  '/jazzcash',
  protect,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('transactionId').notEmpty().withMessage('Transaction ID is required'),
    body('mobileNumber').notEmpty().withMessage('Mobile number is required'),
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

      const { bookingId, transactionId, mobileNumber, amount } = req.body;

      // Verify booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized',
        });
      }

      // Create or update payment record
      let payment = await Payment.findOne({ booking: bookingId });
      if (payment) {
        payment.transactionId = transactionId;
        payment.mobileNumber = mobileNumber;
        payment.paymentMethod = 'jazzcash';
        payment.status = 'processing';
        payment.amount = amount || booking.totalAmount;
      } else {
        payment = await Payment.create({
          booking: bookingId,
          user: req.user.id,
          amount: amount || booking.totalAmount,
          paymentMethod: 'jazzcash',
          transactionId,
          mobileNumber,
          status: 'processing',
        });
      }

      res.json({
        success: true,
        message: 'JazzCash payment recorded. Awaiting verification.',
        payment,
      });
    } catch (error) {
      console.error('JazzCash payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// @route   POST /api/payments/easypaisa
// @desc    Record EasyPaisa payment
// @access  Private
router.post(
  '/easypaisa',
  protect,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('transactionId').notEmpty().withMessage('Transaction ID is required'),
    body('mobileNumber').notEmpty().withMessage('Mobile number is required'),
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

      const { bookingId, transactionId, mobileNumber, amount } = req.body;

      // Verify booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized',
        });
      }

      // Create or update payment record
      let payment = await Payment.findOne({ booking: bookingId });
      if (payment) {
        payment.transactionId = transactionId;
        payment.mobileNumber = mobileNumber;
        payment.paymentMethod = 'easypaisa';
        payment.status = 'processing';
        payment.amount = amount || booking.totalAmount;
      } else {
        payment = await Payment.create({
          booking: bookingId,
          user: req.user.id,
          amount: amount || booking.totalAmount,
          paymentMethod: 'easypaisa',
          transactionId,
          mobileNumber,
          status: 'processing',
        });
      }

      res.json({
        success: true,
        message: 'EasyPaisa payment recorded. Awaiting verification.',
        payment,
      });
    } catch (error) {
      console.error('EasyPaisa payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// @route   POST /api/payments/bank-transfer
// @desc    Record bank transfer payment
// @access  Private
router.post(
  '/bank-transfer',
  protect,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('transactionId').notEmpty().withMessage('Transaction ID is required'),
    body('bankName').notEmpty().withMessage('Bank name is required'),
    body('accountNumber').notEmpty().withMessage('Account number is required'),
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

      const { bookingId, transactionId, bankName, accountNumber, amount } = req.body;

      // Verify booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized',
        });
      }

      // Create or update payment record
      let payment = await Payment.findOne({ booking: bookingId });
      if (payment) {
        payment.transactionId = transactionId;
        payment.bankName = bankName;
        payment.accountNumber = accountNumber;
        payment.paymentMethod = 'bank-transfer';
        payment.status = 'processing';
        payment.amount = amount || booking.totalAmount;
      } else {
        payment = await Payment.create({
          booking: bookingId,
          user: req.user.id,
          amount: amount || booking.totalAmount,
          paymentMethod: 'bank-transfer',
          transactionId,
          bankName,
          accountNumber,
          status: 'processing',
        });
      }

      res.json({
        success: true,
        message: 'Bank transfer payment recorded. Awaiting verification.',
        payment,
      });
    } catch (error) {
      console.error('Bank transfer error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// @route   POST /api/payments/qr-payment
// @desc    Record QR code payment
// @access  Private
router.post(
  '/qr-payment',
  protect,
  [
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
    body('upiId').optional(),
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

      const { bookingId, upiId } = req.body;

      // Verify booking
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized',
        });
      }

      // Create or update payment record
      let payment = await Payment.findOne({ booking: bookingId });
      if (payment) {
        payment.paymentMethod = 'qr';
        payment.upiId = upiId || null;
        payment.status = 'pending';
      } else {
        payment = await Payment.create({
          booking: bookingId,
          user: req.user.id,
          amount: booking.totalAmount,
          paymentMethod: 'qr',
          upiId: upiId || null,
          status: 'pending',
        });
      }

      // Generate QR code URL (you can integrate with a QR code generator)
      const qrData = `upi://pay?pa=${process.env.UPI_ID || 'your-upi-id@paytm'}&pn=ServEase&am=${booking.totalAmount}&cu=INR&tn=Booking-${bookingId}`;
      payment.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
      await payment.save();

      res.json({
        success: true,
        message: 'QR payment initialized',
        payment,
        qrCodeUrl: payment.qrCodeUrl,
      });
    } catch (error) {
      console.error('QR payment error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// @route   GET /api/payments/:id
// @desc    Get payment details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Verify user owns the payment or is admin
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// @route   GET /api/payments/booking/:bookingId
// @desc    Get payment for a booking
// @access  Private
router.get('/booking/:bookingId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate('booking')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this booking',
      });
    }

    // Verify user owns the payment or is admin
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Get payment by booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;

