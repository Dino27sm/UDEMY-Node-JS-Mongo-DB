const fs = require('fs');

// To use "superagent" function from "npm" packages
const superagent = require('superagent');

fs.readFile('dog.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);

  superagent.get(`https://dog.ceo/api/breed/${data}/images`).end((err, res) => {
    if (err) throw err;
    console.log(res.body.message[0]);
  });
});
