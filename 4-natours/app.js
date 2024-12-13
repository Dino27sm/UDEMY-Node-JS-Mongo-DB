const express = require('express');
const morgan = require('morgan');

const app = express();

// 1. MIDDLEWARE Definition (stays between Request and Response)
app.use(morgan('dev'));
app.use(express.json());

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
//
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//-------------------------------------------------------
// 4. START the SERVER
//
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
