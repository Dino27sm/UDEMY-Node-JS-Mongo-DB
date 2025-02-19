const mongoose = require('mongoose');
const slugify = require('slugify');
const { trim } = require('validator');

// mongoDB "Schema" and "model"
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,

      // These are VALIDATORS
      required: [true, 'A tour must have a name.'],
      maxlength: [40, 'Name must not exceed 40 symbols!!!'],
      minlength: [10, 'Name must contain at least 10 symbols!!!'],
      unique: true,
      trim: true,
    },
    slug: { type: String },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be: easy, medium or difficult !!!',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than 1.0 !!!'],
      max: [5, 'Rating must be less than 5.0 !!!'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (discValue) {
          return discValue < this.price;
        },
        message: `Discount ({VALUE}) cannot be greater than price !!!`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [false, 'A tour must have a summary.'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [false, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // To NOT display "createdAt"
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before ".save()" and ".create()"
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) {
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  const queryTime = Date.now() - this.start;

  // console.log(docs);
  console.log(`Query took ${queryTime} milsec to be created. 👌`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});
//-----------------------------------------------------
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
