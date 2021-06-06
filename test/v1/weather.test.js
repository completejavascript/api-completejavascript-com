const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index.js");

const should = chai.should(); // @IMPORTANT -> need for testing
const HOST = process.env.HOST;

chai.use(chaiHttp);

describe("Weather", () => {
  it("it should return weather data", (done) => {
    const lat = "21.0245";
    const lng = "105.8412";

    chai
      .request(server)
      .get(`/api/v1/weather?lat=${lat}&lng=${lng}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message");
        res.body.should.have.property("lat").eql(lat);
        res.body.should.have.property("lng").eql(lng);
        res.body.should.have.property("apiVersion").eql("1");
        res.body.should.have.property("data");
        res.body.data.should.be.a("object");
        res.body.data.should.have.property("currently");
        res.body.data.should.have.property("hourly");
        res.body.data.should.have.property("daily");
        done();
      });
  }).timeout(10000);

  it("it should an error when missing all query strings", (done) => {
    chai
      .request(server)
      .get(`/api/v1/weather`)
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
          .eql(`${HOST}/api/v1/weather`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when only have lat query string", (done) => {
    chai
      .request(server)
      .get(`/api/v1/weather?lat=80`)
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
          .eql(`${HOST}/api/v1/weather?lat=80`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when only have lng query string", (done) => {
    chai
      .request(server)
      .get(`/api/v1/weather?lng=120`)
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
          .eql(`${HOST}/api/v1/weather?lng=120`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when the value of latitude is invalid range", (done) => {
    chai
      .request(server)
      .get(`/api/v1/weather?lat=100&lng=80`)
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
          .eql(`${HOST}/api/v1/weather?lat=100&lng=80`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when the value of longitude is invalid range", (done) => {
    chai
      .request(server)
      .get(`/api/v1/weather?lat=80&lng=280`)
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
          .eql(`${HOST}/api/v1/weather?lat=80&lng=280`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when the value of latitude is invalid type", (done) => {
    chai
      .request(server)
      .get(`/api/v1/weather?lat=abc&lng=280`)
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
          .eql(`${HOST}/api/v1/weather?lat=abc&lng=280`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);

  it("it should an error when the value of longitude is invalid type", (done) => {
    chai
      .request(server)
      .get(`/api/v1/weather?lat=80&lng=abc`)
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
          .eql(`${HOST}/api/v1/weather?lat=80&lng=abc`);
        res.body.should.have.property("apiVersion").eql("1");
        done();
      });
  }).timeout(10000);
});
