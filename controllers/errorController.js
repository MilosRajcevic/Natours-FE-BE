const sendErrorDev = (dev, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (dev, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programing or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.log('ERROR 💥💥💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Someting went very wrong',
    });
  }
};

// Middleware for globarErrorHandler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'developmnet') {
    sendErrorDev(err, res);
  } else if (procces.env.NODE_ENV === 'production') {
    sendErrorProd(dev, res);
  }
};
