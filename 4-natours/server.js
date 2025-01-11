const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// By this line - read the file and set the variables in it
// to "nodeJS" environment
dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

const localDB = 'mongodb://localhost:27017/myDatabase';
const DB = localDB;
console.log(DB);

mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log(con.connections);
    console.log('DB connection succeeded !!!');
  });

//
console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
