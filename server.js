const http = require('http');
const app = require('./app');
const config = require('config');

const port = process.env.PORT || config.get('PORT');

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = server; // for testing