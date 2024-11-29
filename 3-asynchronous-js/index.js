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
      resolve('Success!');
    });
  });
};

// // ======== Using chained Promises to avoid "Callback Hell" ============
// //
// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images`);
//   })
//   .then((res) => {
//     const dogPictures = res.body.message.join(',\n');
//     return writeFilePromise('dog-img.txt', dogPictures);
//   })
//   .then(() => {
//     console.log(`Dog img saved into a file! 👌`);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// //=======================================================================
//
//=========== Using Async/Await way to consume Promises ====================
//
const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images`
    );
    const dogPictures = res.body.message.join(',\n');

    await writeFilePromise('dog-img.txt', dogPictures);
    console.log(`Dog img saved into a file! 👌`);
  } catch (error) {
    console.log(error);
    throw error;
  }
  return '2. Returned message from getDogPic! 🐶';
};

// getDogPic();
//
// //================ Getting Values from Async/Await functions ===============
// //
// console.log('1. Start getting Dog pictures!');
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log('3. Done getting Dog pics!');
//   })
//   .catch((err) => {
//     console.log('ERROR ! 💥💥💥');
//   });
// //
//================ Another way - without using ".then()" ====================
//
(async () => {
  try {
    console.log('1. Start getting Dog pictures!');
    const getDogPicData = await getDogPic();
    console.log(getDogPicData);
    console.log('3. Done getting Dog pics!');
  } catch (error) {
    console.log('ERROR ! 💥💥💥');
  }
})();
