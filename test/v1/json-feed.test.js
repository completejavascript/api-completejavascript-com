const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index.js");

const should = chai.should(); // @IMPORTANT -> need for testing
const HOST = process.env.HOST;

chai.use(chaiHttp);

describe("JSON feed", () => {
  it("it should turn RSS feed into JSON", (done) => {
    const feedUrl = "https://davidwalsh.name/feed";

    chai
      .request(server)
      .get(`/api/v1/jsonfeed?url=${feedUrl}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("url").eql(feedUrl);
        res.body.should.have.property("apiVersion").eql("1");
        res.body.should.have.property("feed");
        res.body.feed.should.be.a("object");
        res.body.feed.should.have.property("link");
        res.body.feed.should.have.property("title");
        res.body.feed.should.have.property("description");
        res.body.feed.should.have.property("language");
        res.body.feed.should.have.property("feedUrl").eql(feedUrl);
        res.body.feed.should.have.property("items");
        res.body.feed.items.should.be.a("array");
        done();
      });
  }).timeout(10000);

  it("it should an error when missing query string", (done) => {
    chai
      .request(server)
      .get(`/api/v1/jsonfeed`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.a("object");
        res.body.error.should.have.property("message");
        res.body.should.have.property("request");
        res.body.request.should.be.a("object");
        res.body.request.should.have.property("method").eql("GET");
        res.body.request.should.have
          .property("url")
          .eql(`${HOST}/api/v1/jsonfeed`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when the value of query string is not a URL", (done) => {
    chai
      .request(server)
      .get(`/api/v1/jsonfeed?url=abc`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.a("object");
        res.body.error.should.have.property("message");
        res.body.should.have.property("request");
        res.body.request.should.be.a("object");
        res.body.request.should.have.property("method").eql("GET");
        res.body.request.should.have
          .property("url")
          .eql(`${HOST}/api/v1/jsonfeed?url=abc`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when the url is not a RSS feed URL", (done) => {
    const feedUrl = "https://davidwalsh.name/abc";

    chai
      .request(server)
      .get(`/api/v1/jsonfeed?url=${feedUrl}`)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a("object");
        res.body.should.have.property("error");
        res.body.error.should.be.a("object");
        res.body.error.should.have.property("message");
        res.body.should.have.property("request");
        res.body.request.should.be.a("object");
        res.body.request.should.have.property("method").eql("GET");
        res.body.request.should.have
          .property("url")
          .eql(`${HOST}/api/v1/jsonfeed?url=${feedUrl}`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);
});
