const app = require('./app');

console.log(app.get('env')); // Gets the Environment variables

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
