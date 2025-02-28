const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

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
