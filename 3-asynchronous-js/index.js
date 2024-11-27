const fs = require('fs');

// To use "superagent" function from "npm" packages
const superagent = require('superagent');

fs.readFile('dog.txt', 'utf8', (err, data) => {
  if (err) return console.log(err.message);
  console.log(data);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images`)
    .then((res) => {
      console.log(res.body.message);
      const dogPictures = res.body.message.join(',\n');

      fs.writeFile('dog-img.txt', dogPictures, (err) => {
        if (err) return console.log(err.message);
        console.log(`Dog img saved into a file!`);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});
