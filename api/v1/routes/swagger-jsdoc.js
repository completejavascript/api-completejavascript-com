const router = require('express').Router();
const swaggerJSDoc = require('swagger-jsdoc');
const config = require('config');

// Setup up swagger-jsdoc
const swaggerDefinition = {
  info: {
    title: "Complete JavaScript's Public APIs Documentation",
    version: "1.0.0",
    description: "<p>This is an API documentation of public RESTful APIs from <a href=\"https://completejavascript.com\">Complete Javascript</a> for developers.</p>" + 
                 "<p>API Support: <a href=\"mailto:completejavascript.super@gmail.com\">completejavascript.super@gmail.com</a> | " + 
                 "Made with ❤️ by: <a href=\"https://completejavascript.com\">Complete Javascript</a>.</p>",
  },
  host: config.get('SWAGGER_HOST'),
};

const options = {
  swaggerDefinition,
  apis: ["./api/v1/routes/json-feed.js"],
  basePath: './api/v1'
};

const swaggerSpec = swaggerJSDoc(options);

// Routes for docs and generated swagger spec
router.get("/swagger.json", (req, res, next) => {
  res.status(200).json(swaggerSpec);
});

module.exports = router;