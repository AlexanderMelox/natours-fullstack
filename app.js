const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
// import app routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Instantiate the express app
const app = express();
// Apply middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // this is for informational log about requests
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// adds the routes to our app as middleware
app.use('/api/tours', tourRouter);
app.use('/api/users', userRouter);

// handles all other routes that isn't in the API
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// Global error handling
app.use(globalErrorHandler);

module.exports = app;
