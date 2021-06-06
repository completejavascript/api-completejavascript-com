/*
 * Handling requests for Weather API
 */
const router = require("express").Router();
const fetch = require("node-fetch");

/**
 * @swagger
 * /api/v1/weather:
 *   get:
 *     summary: Get weather data
 *     description: Returns weather data from a location by latitude and longitude.
 *     tags:
 *       - Weather
 *     externalDocs:
 *       description: View Demo
 *       url: /demo/v1/weather
 *     parameters:
 *       - in: query
 *         name: lat
 *         type: string
 *         description: Latitude
 *         required: true
 *       - in: query
 *         name: lng
 *         type: string
 *         description: Longitude
 *         required: true
 *     responses:
 *       '200':
 *         description: JSON contains the weather data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message from server
 *                 lat:
 *                   type: string
 *                   description: Passed latitude
 *                 lng:
 *                   type: string
 *                   description: Passed longitude
 *                 apiVersion:
 *                   type: string
 *                   description: API version
 *                 data:
 *                   description: Weather data
 *                   type: object
 *       '400':
 *         description: Bad request - missing query string or value is invalid GeoCoordinate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   description: Error informations
 *                   properties:
 *                     message:
 *                       description: Error message detail
 *                       type: string
 *                 request:
 *                   type: object
 *                   description: Other informations
 *                   properties:
 *                     method:
 *                       description: Request method
 *                       type: string
 *                     url:
 *                       description: Request URL
 *                       type: string
 *                 apiVersion:
 *                   type: string
 *                   description: API version
 *       '500':
 *         description: Internal Server Error while fetching the weather data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   description: Error informations
 *                   properties:
 *                     message:
 *                       description: Error message detail
 *                       type: string
 *                 request:
 *                   type: object
 *                   description: Other informations
 *                   properties:
 *                     method:
 *                       description: Request method
 *                       type: string
 *                     url:
 *                       description: Request URL
 *                       type: string
 *                 apiVersion:
 *                   type: string
 *                   description: API version
 */
router.get("/", async (req, res, next) => {
  const { lat, lng } = req.query;

  if (lat === undefined) {
    const error = new Error("Missing lat in query string");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }

  if (lng === undefined) {
    const error = new Error("Missing lng in query string");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }

  if (isNaN(lat)) {
    const error = new Error("Latitude value is not a number");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }

  if (isNaN(lng)) {
    const error = new Error("Longitude value is not a number");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }

  if (lat < -90 || lat > 90) {
    const error = new Error("Latitude must be a number between -90 and 90");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }

  if (lng < -180 || lng > 180) {
    const error = new Error("Longitude must be a number between -180 and 180");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }

  try {
    const secretKey = process.env.DARKSKY_SECRET_KEY;
    const requestURL = `https://api.darksky.net/forecast/${secretKey}/${lat},${lng}`;

    const weatherRes = await fetch(requestURL);
    const weatherJson = await weatherRes.json();
    const { code, error } = weatherJson;

    if (error) {
      const err = new Error(error);
      err.status = code;
      err.apiVersion = "1";
      next(error);
    } else {
      res.status(200).json({
        message: "Weather data",
        lat,
        lng,
        apiVersion: "1",
        data: weatherJson,
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.status = 500;
    error.apiVersion = "1";
    next(error);
  }
});

module.exports = router;
