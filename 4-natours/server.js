const dotenv = require('dotenv');

// By this line - read the file and set the variables in it
// to "nodeJS" environment
dotenv.config({ path: './config.env' });

const app = require('./app');

console.log(process.env.NODE_ENV);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
