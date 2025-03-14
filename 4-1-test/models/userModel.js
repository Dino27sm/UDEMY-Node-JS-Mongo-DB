const mongoose = require('mongoose');
const validator = require('validator');

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
  },

  passwordConfirm: {
    type: String,
    required: [true, 'You must Confirm the Password !'],
    validate: {
      // This Works only on SAVE !!!
      validator: function (elm) {
        return elm === this.password;
      },
    },
  },
});

//==============================================================
const User = mongoose.model('User', userSchema);

module.exports = User;
