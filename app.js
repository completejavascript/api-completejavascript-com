const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');

const jsonFeedRoutesV1 = require('./api/v1/routes/json-feed.js');
const swaggerDocRoutesV1 = require('./api/v1/routes/swagger-jsdoc.js');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('resources'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Set common headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers', 
    'Accept, Authorization, Content-Type, X-Requested-With, Range'
  );
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    return res.status(200).json({});
  }
  
  next();
});

// Configure for server's frontend
if (config.get('API_VERSION') === '1') {
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/v1/docs/redoc.html');
  });
  
  app.get('/docs/v1/', (req, res) => {
    res.sendFile(__dirname + '/public/v1/docs/redoc.html');
  });
  
  app.get('/demo/v1/json-feed', (req, res) => {
    res.sendFile(__dirname + '/public/v1/demo/json-feed.html');
  });
}

// Handling valid requests
app.use('/api/v1/jsonfeed', jsonFeedRoutesV1);
app.use('/api/v1/docs', swaggerDocRoutesV1);

// Hanling 404 requests
app.use((req, res, next) => {
  const error = new Error('Request not found');
  error.status = 404;
  next(error);
});

// Handling errors
app.use((error, req, res, next) => {
  res.status(error.status);
  res.json({
    error: {
      message: error.message
    },
    request: {
      method: req.method,
      url: `${config.get('HOST')}${req.originalUrl}`
    },
    apiVersion: error.apiVersion
  });
});

module.exports = app;