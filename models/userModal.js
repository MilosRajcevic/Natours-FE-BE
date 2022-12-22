const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    require: [true, 'Please provide your email'],
    unique: true,
    lowercasse: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    require: [true, 'Please provide a password'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!! // When we want to update user passwrod this validation doesnt work
      validator: function (el) {
        return this.password === el;
      },
      message: 'Password are not the same',
    },
  },
});

// Mongoose documentation middleware
userSchema.pre('save', async function (next) {
  // Only run this function is password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
