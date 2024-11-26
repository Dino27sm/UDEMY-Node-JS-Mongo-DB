const fs = require('fs');

// To use "superagent" function from "npm" packages
const superagent = require('superagent');

fs.readFile('dog.txt', 'utf8', (err, data) => {
  if (err) return console.log(err.message);
  console.log(data);

  superagent.get(`https://dog.ceo/api/breed/${data}/images`).end((err, res) => {
    if (err) return console.log(err.message);

    fs.writeFile('dog-img.txt', res.body.message[0], (err) => {
      console.log(`Dog img saved into a file!`);
    });
  });
});
