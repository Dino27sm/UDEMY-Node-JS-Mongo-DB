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
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
