const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index.js");

const should = chai.should(); // @IMPORTANT -> need for testing
const HOST = process.env.HOST;

chai.use(chaiHttp);

describe("JSON feed", () => {
  it("it should return wikipedia result", (done) => {
    const searchText = "dog";

    chai
      .request(server)
      .get(`/api/v1/wikipedia?search=${searchText}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("search").eql(searchText);
        res.body.should.have.property("apiVersion").eql("1");
        res.body.should.have.property("data");
        res.body.data.should.be.a("object");
        res.body.data.should.have.property("query");
        res.body.data.query.should.be.a("object");
        res.body.data.query.should.have.property("pages");
        res.body.data.query.pages.should.be.a("object");
        done();
      });
  }).timeout(10000);

  it("it should an error when missing query string", (done) => {
    chai
      .request(server)
      .get(`/api/v1/wikipedia`)
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
          .eql(`${HOST}/api/v1/wikipedia`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when the value of query string is empty", (done) => {
    chai
      .request(server)
      .get(`/api/v1/wikipedia?url=`)
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
          .eql(`${HOST}/api/v1/wikipedia?url=`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);
});
