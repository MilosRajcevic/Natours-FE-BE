const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    unique: false,
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
    select: false,
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
  passwordChangedAt: Date,
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

// Instance method - available method on all documents
userSchema.methods.correctPassword = async function (
  candidatePasswrod,
  userPassword
) {
  return await bcrypt.compare(candidatePasswrod, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTImestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTImestamp;
  }
  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
