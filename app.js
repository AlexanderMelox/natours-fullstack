import express from 'express';
import morgan from 'morgan';

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

module.exports = app;
