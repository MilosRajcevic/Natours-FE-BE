const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

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

exports.getOne = (Model, populateOptions) =>
  catchAsyncError(async (req, res, next) => {
    // Populate is fundamental toll for working with data in Mongoose
    // If we just want to populate on request, else do like query (check tourModel file)
    // const tour = await Tour.findById(req.params.id).populate({
    //   path: 'guides',
    //   // remove fields
    //   select: '-__v -passwordChangedAt',
    // });
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID'), 404);
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

exports.getAll = (Model) =>
  catchAsyncError(async (req, res, next) => {
    // To allow for nested GET revievs on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .fieldLimit()
      .pagination();

    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
