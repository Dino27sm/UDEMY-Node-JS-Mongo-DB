const fs = require('fs');

// To use "superagent" function from "npm" packages
const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) reject('I could not find that file! 😒');
      resolve(data);
    });
  });
};

readFilePro(`${__dirname}/dog.txt`).then((data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images`)
    .then((res) => {
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
