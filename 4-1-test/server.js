const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');
const { type } = require('os');
dotenv.config({ path: './config.env' });

//------------------------------------------------------
// const db = 'mongodb://localhost/natours-test';
let db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db, {}).then(() => console.log('DB connection successful!'));
//------------------------------------------------------
// mongoDB "Schema" and "model"
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'A tour must have a name.'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price.'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.8,
  price: 597,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log(`ERROR 💥💥💥: `, err);
  });
//------------------------------------------------------
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
