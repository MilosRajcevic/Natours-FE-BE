const User = require('../models/userModal');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: null,
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: null,
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: null,
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: null,
  });
};
