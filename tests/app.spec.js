// Import the dependencies for testing
var chai = require("chai");
var chaiHttp = require("chai-http");
var expect = require("chai").expect;
var app = require("../app");

// Configure chai
chai.use(chaiHttp);
chai.should();

/* eslint-disable */

describe("validation service", () => {
  describe("GET /", () => {
    it("should respond with status 200 and should return something", done => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("POST /", () => {
    describe("insufficient data provided", () => {
      it("should respond with status 400 if empty request is done", done => {
        chai
          .request(app)
          .post("/")
          .send(null)
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });

      it("should respond with status 400 if no id is given", done => {
        chai
          .request(app)
          .post("/")
          .send({
            some: "useless",
            data: 123
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
      it("should respond with status 400 if no transaction-object is given", done => {
        chai
          .request(app)
          .post("/")
          .send({
            id: "we have an id this time!",
            but: "nothing more"
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });

      it("should respond with status 403 (Forbidden) if product-id is wrong", done => {
        chai
          .request(app)
          .post("/")
          .send({
            id: "com.fakes.awesomeapp",
            transaction: {
              type: "android-playstore"
            }
          })
          .end((err, res) => {
            res.should.have.status(403);
            done();
          });
      });

      it("should respond with status 400 if there is no receipt in transaction-data", done => {
        var config = require("../config");
        chai
          .request(app)
          .post("/")
          .send({
            id: config.service.appDomain + ".testapp", //we want it to stop because of missing receipt, not bc. of wrong appDomain!
            transaction: {
              type: "ios-appstore"
              //appStoreReceipt: {"any":"thing"}
            }
          })
          .end((err, res) => {
            res.should.have.status(400);
            done();
          });
      });
    });

    describe("valid receipt provided", () => {
      it("should respond with status 200 and `ok:true` for purchased product (iOS)", done => {
        var validData = require("./requests/valid_ios_consumable.json");
        chai
          .request(app)
          .post("/")
          .send(validData)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body).to.deep.include({ ok: true });
            expect(res.body.data).to.be.a("object");
            done();
          });
      }).timeout(10000);

      it("should respond with status 200 and `ok:true` for purchased product (Android)", done => {
        var validData = require("./requests/valid_android_consumable.json");
        chai
          .request(app)
          .post("/")
          .send(validData)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body).to.deep.include({ ok: true });
            expect(res.body.data).to.be.a("object");
            done();
          });
      }).timeout(10000);
    });

    describe("expired receipt provided", () => {
      it("should respond with status 200 but `ok:false` and expired hint for expired products (iOS)", done => {
        var validData = require("./requests/expired_ios_subscription.json");
        chai
          .request(app)
          .post("/")
          .send(validData)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body).to.deep.include({ ok: false });
            expect(res.body.data.code).to.equal(6778003);
            done();
          });
      }).timeout(10000);

      /* ignore Android test for now!
      it("should respond with status 200 but `ok:false` and expired hint for expired products (Android)", done => {
        var validData = require("./requests/expired_abdroid_subscription.json");
        chai
          .request(app)
          .post("/")
          .send(validData)
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body).to.deep.include({ ok: false });
            expect(res.body.data.code).to.equal(6778003);
            done();
          });
      }).timeout(10000);
      */
    });
  });
});
