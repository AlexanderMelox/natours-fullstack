const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Import the express app
const app = require('./app');

// Specifies the port for the app to listen to
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port http://localhost:${port}`);
});
