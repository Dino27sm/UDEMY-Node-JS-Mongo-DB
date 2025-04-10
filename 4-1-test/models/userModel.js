const crypto = require('crypto-js');
const AES = require('crypto-js/aes');
const passwordGenerator = require('generate-password');
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

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

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
  passwordResetToken: String, // Temporary password
  passwordResetExpires: Date,
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

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;

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

// Creating a "temporary password"
userSchema.methods.createPasswordResetToken = function () {
  // Random Password srting creating
  const newRandomPassword = passwordGenerator.generate({
    length: 12,
    numbers: true,
  });

  // Encripting generated random password
  const resetToken = crypto.AES.encrypt(
    newRandomPassword,
    'secret key 123'
  ).toString();

  // this.passwordResetToken = resetToken;

  console.log(`=== Random generated password: ${newRandomPassword}`);
  console.log(`=== Encrypted password: `, { resetToken });

  // // Decrypting of generated password ==============================
  // const decrypedPassword = crypto.AES.decrypt(
  //   this.passwordResetToken,
  //   'secret key 123'
  // );
  // const originalText = decrypedPassword.toString(crypto.enc.Utf8);
  // console.log(originalText);
  // //================================================================

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

//==============================================================
const User = mongoose.model('User', userSchema);

module.exports = User;
