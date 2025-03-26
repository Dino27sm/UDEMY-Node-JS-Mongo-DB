const mongoose = require('mongoose');
const validator = require('validator');

// First install "bcryptjs" in terminal mode: > npm i bcryptjs
const bcrypt = require('bcryptjs');

// Shema for - name, email, photo, password, passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,

    // These are VALIDATORS
    required: [true, 'Please, write down your name !'],
    maxlength: [40, 'Name must not exceed 40 symbols !!!'],
    minlength: [2, 'Name must contain at least 2 symbols !!!'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'You must have an E-mail !'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please, provide a valid email !'],
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'You must use a Password !'],
    minlength: [8, 'Use not less than 8 symbols !'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'You must Confirm the Password !'],
    validate: {
      // This Works only on CREATE and SAVE !!!
      validator: function (elm) {
        return elm === this.password;
      },
      message: 'Passwords are not the same !',
    },
  },

  passwordChangedAt: Date,
});

// To ENCRYPT Passwords in Database
userSchema.pre('save', async function (next) {
  // Run this function only if password is chaged
  if (!this.isModified('password')) return next();

  // Encrypting passwords by using "hash" method with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete "passwordConfirm" from Database
  this.passwordConfirm = undefined;

  next();
});

// To Check if "login password" and "user password" are the same?
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// To Check if "password" has been changed
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // "false" means NOT changed !!!
  return false;
};
//==============================================================
const User = mongoose.model('User', userSchema);

module.exports = User;
