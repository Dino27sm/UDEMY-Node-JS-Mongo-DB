const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicated field value: (${err.keyValue.name}). Please, use another one!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token ! Please, log-in again !', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token expired ! Please, log-in again !', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational Errors => Send Error Messages to Clients
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR 💥💥💥', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong !!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'ERROR !';

  let errDuplct = JSON.parse(JSON.stringify(err));

  if (errDuplct.name === 'CastError') {
    errDuplct = handleCastErrorDB(errDuplct);
  }
  if (errDuplct.code === 11000) {
    errDuplct = handleDuplicateFieldsDB(errDuplct);
  }
  if (errDuplct.name === 'ValidationError') {
    errDuplct = handleValidationErrorDB(errDuplct);
  }
  if (errDuplct.name === 'JsonWebTokenError') {
    errDuplct = handleJWTError();
  }
  if (errDuplct.name === 'TokenExpiredError') {
    errDuplct = handleJWTExpiredError();
  }

  sendErrorProd(errDuplct, res);
  next();
};
//
// //=============== Correctly Working OLD Version ================
// module.exports = (err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'ERROR !';

//   res.status(err.statusCode).json({
//     status: err.status,
//     // message: err.message,
//     message: err,
//   });

//   next();
// };
