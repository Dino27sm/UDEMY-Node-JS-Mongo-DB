const fs = require("fs");

// // Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output-1.txt", textOut);
// console.log("File has been written!");

// Non-blocking, asynchronous way
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      fs.writeFile(
        "./txt/final.txt",
        `${data2} --- ${data3}`,
        "utf-8",
        (err) => {
          console.log("The final file has been written ! 😁");
        }
      );
    });
  });
});

console.log("----------- Start reading files ! --------------");
