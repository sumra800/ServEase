const express = require('express');
const router = express.Router();

// @route   GET /api/services
// @desc    Get all available services
// @access  Public
router.get('/', async (req, res) => {
  try {
    const services = [
      {
        id: 1,
        name: 'House Help',
        icon: 'FaHome',
        description: 'Professional cleaning, cooking, and household maintenance',
        price: 'Starting at Rs.500/day',
        basePrice: 500,
        features: ['Deep cleaning', 'Cooking', 'Laundry', 'Grocery shopping'],
      },
      {
        id: 2,
        name: 'Childcare',
        icon: 'FaBaby',
        description: 'Certified nannies and babysitters for your children',
        price: 'Starting at Rs.800/day',
        basePrice: 800,
        features: ['Child supervision', 'Meal preparation', 'Homework help', 'Play activities'],
      },
      {
        id: 3,
        name: 'Elderly Care',
        icon: 'FaHeart',
        description: 'Compassionate nurses and caregivers for seniors',
        price: 'Starting at Rs.1000/day',
        basePrice: 1000,
        features: ['Medical assistance', 'Personal care', 'Medication management', 'Companionship'],
      },
      {
        id: 4,
        name: 'Pet Care',
        icon: 'FaDog',
        description: 'Reliable pet sitters and walkers for your furry friends',
        price: 'Starting at Rs.400/day',
        basePrice: 400,
        features: ['Pet walking', 'Feeding', 'Grooming', 'Playtime'],
      },
    ];

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;

