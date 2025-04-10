const crypto = require('crypto-js');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: +process.env.JWT_EXPIRES_IN, // Expires in 20 days - see "config.env"
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token, // To send created "token"
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if "email" and "password" exist
  if (!email || !password) {
    return next(new AppError('Please, provide email and password !', 400));
  }

  // 2. Check if User exists and the "password" is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Icorrect email or password !', 401));
  }

  // 3. If everything is OK, send "jwt" token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Check if "token" created and exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are NOT logged in ! Please, try again !', 401)
    );
  }

  // 2. Verify validity of "token"
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if the User still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('NO user with this token !', 401));
  }

  // 4. Check if the User changed the password after the last "token" created
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Password recetly changed ! Please, Log-in again !', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser; // "req.user" passes "user" to the next middleware
  next();
});

// Checking for rights of "user" given by "role"
// Middleware functions cannot receive other than "req, res, next"
// Use this way to pass other parameters !!!
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ["admin", "lead-guide"] >> IF role = "user" >> Error generated
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are NOT allowed for this !', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get the "user" based on POSTed "email"
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('NO User with that Email address !', 404));
  }

  // 2. Create the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send it to the mail of the user
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \n If you remember your password, then ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 min)`,
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to the email !',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Error in sending the email ! Try again later !', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get the "user" related to a certain "token"
  const hashedToken = crypto.AES.encrypt(
    req.params.token,
    'secret key 123'
  ).toString();

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);
  // 2. Set the new password if "token" not expired and there is a "user"
  if (!user) {
    return next(new AppError('Token is invalid or has expired !', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. Update the user's "changedPasswordAt" property
  // 4. Log-in the "user" and send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
