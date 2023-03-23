const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');

exports.getOverview = catchAsyncError(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
  // 1) Get the data, for the requested tour ( including reviews and guides )
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'guides',
    })
    .populate({ path: 'reviews', fields: 'review rating user' });

  // 2) Build template
  // 3) Render taht template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name}`,
    tour,
  });
});

exports.getLoginForm = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "script-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login', {
      title: 'Login',
    });
});