const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: `./../../config.env` });

//------------------------------------------------------
let db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db, {}).then(() => console.log('DB connection successful!'));
//------------------------------------------------------
// READ JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA into Mongo-DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfuly loaded !');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE all DATA from mongo collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfuly deleted !');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// console.log(process.argv[2]);
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
