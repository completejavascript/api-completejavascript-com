/*
* Handling requests for RSS JSON API
*/
const router = require('express').Router();
const Parser = require('rss-parser');
const validUrl = require('valid-url');

const parser = new Parser();

/**
* @swagger
* /api/v1/jsonfeed:
*   get:
*     summary: Convert RSS feed into JSON
*     description: Returns a JSON contains the feed details after converting.
*     tags:
*       - JSON feed
*     externalDocs:
*       description: View Demo
*       url: /demo/v1/json-feed
*     parameters:
*       - in: query
*         name: url
*         type: string
*         description: RSS feed url
*         required: true
*     responses:
*       '200':
*         description: JSON contains the feed details
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message: 
*                   type: string
*                   description: Message dedails
*                 url: 
*                   type: string
*                   description: RSS feed url
*                 apiVersion:
*                   type: string
*                   description: API version
*                 feed:
*                   description: Feed details after converting
*                   type: object
*       '400':
*         description: Bad request - missing query string or value is not URL
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: object
*                   description: Error detail
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
*                       description: Request url
*                       type: string
*                 apiVersion:
*                   type: string
*                   description: API version
*       '500':
*         description: Internal Server Error while turning RSS feed into JSON
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: object
*                   description: Error detail
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
*                       description: Request url
*                       type: string
*                 apiVersion:
*                   type: string
*                   description: API version
*/
router.get('/', async (req, res, next) => {
  const url = req.query.url;
  
  if (url === undefined) {
    const error = new Error("Missing feed's URL in query string");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }
  
  if (!validUrl.isUri(url)) {
    const error = new Error("Not a URL");
    error.status = 400;
    error.apiVersion = "1";
    return next(error);
  }
  
  try {
    let feed = await parser.parseURL(url);
  
    res.status(200).json({
      message: "JSON feed details",
      url,
      apiVersion: "1",
      feed
    });
  } catch (err) {
    const error = new Error(err);
    error.status = 500;
    error.apiVersion = "1";
    next(error);
  }
});

module.exports = router;