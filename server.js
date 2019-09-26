import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
  .then(connection => console.log('Database connection successful'));

// Specifies the port for the app to listen to
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`); //eslint-disable-line
});
