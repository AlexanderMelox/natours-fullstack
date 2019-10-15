const AppError = require('../utils/AppError');

const handleDatabaseCastError = error => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDatabaseDuplicateFieldError = error => {
  const tourName = error.errmsg.split('"')[1];
  const message = `Duplicate field value: ${tourName}. Please use another value.`;
  return new AppError(message, error.statusCode || 400);
};

const handleDatabaseValidationError = error => {
  const errors = Object.values(error.errors).map(err => err.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack
  });
};

const sendErrorProduction = (error, res) => {
  if (error.isOperationalError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  } else {
    console.error('Error:', error); //eslint-disable-line
    // Unknown error from server or db, don't want to leak error details
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let customError = { ...error };
    if (error.name === 'CastError') {
      customError = handleDatabaseCastError(customError);
    }
    if (error.code === 11000) {
      customError = handleDatabaseDuplicateFieldError(customError);
    }
    if (error.name === 'ValidationError') {
      customError = handleDatabaseValidationError(customError);
    }

    sendErrorProduction(customError, res);
  }
};
