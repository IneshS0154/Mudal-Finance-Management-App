const User = require('../models/User');
const { processAutomation } = require('../utils/automation');

// @desc    Get current logged in user
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    processAutomation(req.user.id); // Run in background
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      currency: req.body.currency,
      monthlySalary: req.body.monthlySalary,
      salarySettings: req.body.salarySettings,
      occupation: req.body.occupation,
      phoneNumber: req.body.phoneNumber,
      categories: req.body.categories,
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
