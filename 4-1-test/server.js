const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const { type } = require('os');

//------------------------------------------------------
// const db = 'mongodb://localhost/natours-test';
let db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db, {}).then(() => console.log('DB connection successful!'));
//------------------------------------------------------

//
const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// To handle Errors of Rejections - wrong Password
process.on('unhandledRejection', (err) => {
  console.log(`Unhandled REJECTION ! 💥💥💥 Shutting down ... !`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// To handle Errors of UNCAUGHT EXCEPTION
process.on('uncaughtException', (err) => {
  console.log(`UCAUGHT EXCEPTION ! 💥💥💥 Shutting down ... !`);
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
