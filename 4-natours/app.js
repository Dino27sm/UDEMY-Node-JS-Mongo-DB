const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. MIDDLEWARE Definition (stays between Request and Response)
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// A Way to get access to Static Files
app.use(express.static(`${__dirname}/public/`));

// Create Own Middleware here -------------------------------
app.use((req, res, next) => {
  console.log('Hello from my Middleware! 👋');
  next(); // NEVER Forget to put this "next()" at the end !!!
});

app.use((req, res, next) => {
  req.requestTime = new Date().toUTCString();
  next();
});
//-----------------------------------------------------------
//
// 3. ROUTES
// Here Router are mounted
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//-------------------------------------------------------
// START the SERVER
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App running on port ${port} ...`);
// });

module.exports = app;
