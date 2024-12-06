const fs = require('fs');
const express = require('express');
const app = express();

// MIDDLEWARE Definition - stays between Request and Response
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Here are the URL Routers
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

// Using "req.params" - use ":" to define params
// To make params optional use "?" after it (.../:id?)
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  const id = Number(req.params.id);
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }
  const tour = tours.find((elm) => elm.id === id);

  // Another way to check correctness of the "ID"
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// Use "patch" request to update a specific "tour" in "tours" array
app.patch('/api/v1/tours/:id', (req, res) => {
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour is here ...!>',
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port} ...`);
});
