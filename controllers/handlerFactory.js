const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');

exports.deleteOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID'), 404);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // runValidators check our types in schema, so we can not set string where is typed number!
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No documet found with that ID'), 404);
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.createOne = (Model) =>
  catchAsyncError(async (req, res, next) => {
    // This is the same like Tour.create();
    // const newTour = new Tour({});
    // newTour.save();
    const doc = await Model.create(req.body);

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });
