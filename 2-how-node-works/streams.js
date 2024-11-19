const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // // Solution 1 - Read entire file
  // fs.readFile('test-fille.txt', 'utf8', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // Solution 2 - Streams (reding data file piece by piece)
  const readable = fs.createReadStream('test-file.txt');
  readable.on('data', (chunk) => {
    res.write(chunk);
  });
  readable.on('end', () => {
    res.end();
  });
});
//
//---------------- START Server ------------------
//
server.listen(8070, '127.0.0.1', () => {
  console.log('Listening ...');
});
