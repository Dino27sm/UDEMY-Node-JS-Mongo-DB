const fs = require("fs");
const http = require("http");
const url = require("url");

////// ============= FILES Read / Write ============================
// // Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output-1.txt", textOut);
// console.log("File has been written!");

// // Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2} --- ${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("The final file has been written ! 😁");
//         }
//       );
//     });
//   });
// });

// console.log("----------- Start reading files ! --------------");
////
////// ============= SERVER ============================
// This part of the code executes ones at the begining,
// so we can use Synchronous mode here
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
////----------------------------------------------------
//
const server = http.createServer((req, res) => {
  const pathName = req.url;

  //------ OVERVIEW Page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = dataObj
      .map((elm) => replaceTemplate(tempCard, elm))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);

    //------ PRODUCT Page
  } else if (pathName === "/product") {
    res.end("It is: PRODUCT");

    //------ API Page
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //------ NOT FOUND Page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "My-own-header": "Hello World!",
    });
    res.end("<h1>Page not found !</h1>");
  }
});

server.listen("8070", "127.0.0.1", () => {
  console.log("Listening to requests from Server !");
});
