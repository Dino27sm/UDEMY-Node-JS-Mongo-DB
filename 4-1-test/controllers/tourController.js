const Tour = require('./../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((elm) => delete queryObj[elm]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));
  }
}

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // // 1.1 - FILTERING
    // let queryObj = { ...req.query };
    // // console.log(queryObj);

    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((elm) => delete queryObj[elm]);

    // // 1.2 - ADVANCED FILTERING
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

    // 2. SORTING
    if (req.query.sort) {
      let sortBy = req.query.sort.replaceAll(',', ' ');
      console.log(sortBy);
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3. FIELD LIMITING - to limit display data
    if (req.query.fields) {
      const fieldsStr = req.query.fields.replaceAll(',', ' ');
      console.log(fieldsStr);
      query = query.select(fieldsStr);
    } else {
      query = query.select('-__v');
    }

    // 4. PAGINATION - to display only needed page
    if (req.query.page || req.query.limit) {
      const page = req.query.page * 1;
      const limit = req.query.limit * 1;
      const skip = (page - 1) * limit;
      console.log(`page: ${page}`, typeof page);
      console.log('-----------------------------');
      console.log(`limit: ${limit}`);
      console.log(`skip: ${skip}`);

      query = query.skip(skip).limit(limit);
    }

    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query).filter();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // Creating a new Tour
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tourUpdated = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // [options.new=true] if true, return the modified document instead the original
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tourUpdated,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Not found Data to delete !',
    });
  }
};
