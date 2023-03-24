const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name} Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const hadnleJWTExpireError = () =>
  new AppError('Your token has expired! Please log in again!', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // RENDERD WEBSITE
    console.log('ERROR 💥💥💥', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // B) Programing or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.log('ERROR 💥💥💥', err);

      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Someting went very wrong',
      });
    }
  } else {
    // RENDERD WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
      // B) Programing or other unknown error: don't leak error details
    } else {
      // 1) Log error
      console.log('ERROR 💥💥💥', err);

      // 2) Send generic message
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later',
      });
    }
  }
};

// Middleware for globarErrorHandler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Handle invalid database IDs for requests
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    // Handle duplicate fileds
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    // Handle validation errors
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    // Handle bad JWT error
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    // Handle JWT expired error
    if (err.name === 'TokenExpiredError') err = hadnleJWTExpireError();

    sendErrorProd(err, req, res);
  }
};
