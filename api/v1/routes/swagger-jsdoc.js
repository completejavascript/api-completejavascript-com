const router = require("express").Router();
const swaggerJSDoc = require("swagger-jsdoc");

// Setup up swagger-jsdoc
const swaggerDefinition = {
  info: {
    title: "Complete JavaScript's Public APIs Documentation",
    version: "1.0.0",
    description:
      "<p>This is an API documentation of public RESTful APIs for developers.</p>" +
      '<p>Fork me on Github: <a href="https://github.com/completejavascript/api-completejavascript-com">api-completejavascript-com</a> | ' +
      'Made with ❤️ by: <a href="https://completejavascript.com">Complete Javascript</a></p>',
  },
  host: process.env.SWAGGER_HOST,
};

const options = {
  swaggerDefinition,
  apis: ["./api/v1/routes/json-feed.js", "./api/v1/routes/weather.js"],
  basePath: "./api/v1",
};

const swaggerSpec = swaggerJSDoc(options);

// Routes for docs and generated swagger spec
router.get("/swagger.json", (req, res, next) => {
  res.status(200).json(swaggerSpec);
});

module.exports = router;
