const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// Needed for embedding
// const User = require('./userModal');

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less or equal then 40 charachters',
      ],
      minlength: [
        10,
        'A tour name must have more or equal then 10 charachters',
      ],
      // validate: [validator.isAlpha, 'Tour name must only contain charachters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour should have a difficulity'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be belowe 5.0'],
      set: (value) => Math.round(value * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // this only points to current doc on NEW document creation. That mean this will not work for cases where we want to UPDATE/PATCH object
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      // Trim dont allow us to have a bunch of white space like: '    Bla bla    bla '
      trim: true,
      required: [true, 'A tour must have description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      cordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        tpye: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        cordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // // Embedding - add all guides related for this tour based on user ID
    // guides: Array,
    // Referencing - ref:conection between two models
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
  }
);

// toursSchema.index({ price: 1 });
toursSchema.index({ price: 1, ratingsAverage: -1 });
toursSchema.index({ slug: 1 });

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
toursSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create() // That mean this will not work for cases where we want to UPDATE/PATCH object
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Embedding
// toursSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   // Beacuse it's async function it will retrurn promises, so we need to convert promise in object
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// eslint-disable-next-line prefer-arrow-callback
// toursSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// toursSchema.post('save', function (doc, next){
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE

// toursSchema.pre('find', function (next) {
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}, milliseconds`);
  next();
});

// If want to popuplate all our documents, create like query midl
toursSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    // remove fields
    select: '-__v -passwordChangedAt',
  });
  next();
});

// AGGREGATION MIDDLEWARE
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', toursSchema);

module.exports = Tour;
