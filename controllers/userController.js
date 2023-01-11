const User = require('../models/userModal');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = catchAsyncError(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwrodConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  // We are using findByIdAndUpdate because this is not sensitive data like password, so we can just do updating.
  // We still want to run validators
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
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
