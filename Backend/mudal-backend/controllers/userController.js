const bcrypt = require('bcryptjs');
const User = require('../models/User');

const allowedProfileKeys = [
  'name',
  'currency',
  'occupation',
  'phoneNumber',
  'monthlySalary',
  'salarySettings',
  'categories',
];

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ data: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    for (const key of allowedProfileKeys) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        if (key === 'salarySettings' && req.body.salarySettings && typeof req.body.salarySettings === 'object') {
          const prev =
            user.salarySettings && typeof user.salarySettings.toObject === 'function'
              ? user.salarySettings.toObject()
              : { ...(user.salarySettings || {}) };
          user.salarySettings = { ...prev, ...req.body.salarySettings };
        } else {
          user[key] = req.body[key];
        }
      }
    }

    await user.save();
    res.json({ data: user.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Password change failed' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Account deletion failed' });
  }
};

module.exports = { getProfile, updateProfile, changePassword, deleteAccount };
