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
    });
  });
};

// ======== Using chained Promises to avoid "Callback Hell" ============
//
readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images`);
  })
  .then((res) => {
    const dogPictures = res.body.message.join(',\n');
    return writeFilePromise('dog-img.txt', dogPictures);
  })
  .then(() => {
    console.log(`Dog img saved into a file! 👌`);
  })
  .catch((err) => {
    console.log(err.message);
  });
