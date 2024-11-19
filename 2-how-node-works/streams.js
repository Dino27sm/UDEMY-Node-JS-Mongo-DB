const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // // Solution 1 - Read entire file
  // fs.readFile('test-fille.txt', 'utf8', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // // Solution 2 - Streams (reding data file piece by piece)
  // const readable = fs.createReadStream('test-file.txt');
  // readable.on('data', (chunk) => {
  //   res.write(chunk);
  // });

  // readable.on('end', () => {
  //   res.end();
  // });

  // readable.on('error', (err) => {
  //   console.log(err);
  //   err.statusCode = 500;
  //   res.end('File not found!');
  // });

  // Solution 3 - Pipes (better than Solution 2 and only one to Use !)
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res); // The pattern is: "readableSource.pipe(writableDestination);""
});
//
//---------------- START Server ------------------
//
server.listen(8070, '127.0.0.1', () => {
  console.log('Listening ...');
});
