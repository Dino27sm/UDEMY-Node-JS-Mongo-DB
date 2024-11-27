const fs = require('fs');

// To use "superagent" function from "npm" packages
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject('I could not find that file to read! 😒');
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject(`I could not write the file! 😒`);
      resolve();
      console.log(`Dog img saved into a file!`);
    });
  });
};

readFilePromise(`${__dirname}/dog.txt`).then((data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images`)
    .then((res) => {
      const dogPictures = res.body.message.join(',\n');

      writeFilePromise('dog-img.txt', dogPictures);
    })
    .catch((err) => {
      console.log(err.message);
    });
});
