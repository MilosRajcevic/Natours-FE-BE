const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

exports.aliasTopToursMiddleware = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary';
  next();
};

exports.getAllTours = catchAsyncError(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fieldLimit()
    .pagination();

  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID'), 404);
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.createTour = catchAsyncError(async (req, res, next) => {
  // This is the same like Tour.create();
  // const newTour = new Tour({});
  // newTour.save();
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    status: 'success',
    data: { tour: newTour },
  });
});

exports.updateTour = catchAsyncError(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // runValidators check our types in schema, so we can not set string where is typed number!
    runValidators: true,
  });

  if (!updatedTour) {
    return next(new AppError('No tour found with that ID'), 404);
  }

  res.status(200).json({
    status: 'success',
    data: { tour: updatedTour },
  });
});

exports.deleteTour = catchAsyncError(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID'), 404);
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsyncError(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsyncError(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStats: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    { $addFields: { month: '$_id' } },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numToursStats: 1 },
    },
    {
      $limit: 12,
    },
  ]);

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
