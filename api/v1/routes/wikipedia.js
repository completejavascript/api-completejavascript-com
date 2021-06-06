/*
 * Handling requests for Wikipedia API
 */
const router = require("express").Router();
const fetch = require("node-fetch");

/**
 * @swagger
 * /api/v1/wikipedia:
 *   get:
 *     summary: Search data on Wikipedia
 *     description: Returns search results from Wikipedia.
 *     tags:
 *       - Wikipedia
 *     externalDocs:
 *       description: View Demo
 *       url: /demo/v1/wikipedia
 *     parameters:
 *       - in: query
 *         name: search
 *         type: string
 *         description: Search text
 *         required: true
 *     responses:
 *       '200':
 *         description: JSON contains search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message from server
 *                 search:
 *                   type: string
 *                   description: Passed search text
 *                 apiVersion:
 *                   type: string
 *                   description: API version
 *                 data:
 *                   description: Search result
 *                   type: object
 *       '400':
 *         description: Bad request - missing query string or search text is empty
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
 *         description: Internal Server Error while searching from Wikipedia
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
  let { search } = req.query;

  if (search === undefined) {
    const error = new Error("Missing search in query string");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }

  // format search text
  search = search.trim();

  if (search === "") {
    const error = new Error("Search must be not empty");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }

  try {
    const api =
      "https://en.wikipedia.org/w/api.php?format=json&action=query&" +
      "generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&" +
      "pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";
    const requestURL = api + encodeURIComponent(search);

    const resultRes = await fetch(requestURL);
    const resultJson = await resultRes.json();
    const { code, error } = resultJson;

    if (error) {
      const err = new Error(error);
      err.status = code;
      err.apiVersion = "1";
      next(error);
    } else {
      res.status(200).json({
        message: "Wikipedia search results",
        search,
        apiVersion: "1",
        data: resultJson,
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
