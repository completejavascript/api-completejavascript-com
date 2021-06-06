require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });

const http = require("http");
const app = require("./app");

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = server; // for testing
