const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', error => {
  console.log('Uncaught exception. Shutting down...'); //eslint-disable-line
  console.log(error.name, error.message); //eslint-disable-line
  process.exit(1);
});

dotenv.config({ path: './config.env' });

// Import the express app
const app = require('./app');

const db = process.env.DB.replace('<password>', process.env.DB_PASSWORD);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(connection => console.log('Database connection successful')); //eslint-disable-line

// Specifies the port for the app to listen to
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`); //eslint-disable-line
});

process.on('unhandledRejection', error => {
  console.log('Unhandled rejection. Shutting down...'); //eslint-disable-line
  console.log(error.name, error.message); //eslint-disable-line
  server.close(() => {
    process.exit(1);
  });
});
