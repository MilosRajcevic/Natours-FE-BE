const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'A review must have description'],
    },
    rating: { type: Number, min: 1, max: 5, default: 0 },
    createdAt: { type: Date, default: Date.now(), select: false },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true } }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// DOCUMENT MIDDLEWARE

// QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: 'tour', select: 'name _id' }).populate({
  //   path: 'user',
  //   select: 'name _id',
  // });
  this.populate({
    path: 'user',
    select: 'name _id photo',
  });
  next();
});

// STATIC METHOD
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    // Update stats in Tour Model
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].averageRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post('save', function () {
  // this.constructor because this is what points to the current model.
  this.constructor.calcAverageRatings(this.tour);
});

// So basically, the trick of going around that in a query midddleware, we only have access to the query.
// So again, we need to get access to the document, and so we basically execute this query by using findOne.
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // Passing the data from the pre-middleware to the post middleware, and so then here
  // we retrieved the review document from this variable.
  this.r = await this.clone().findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query was already executed
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
