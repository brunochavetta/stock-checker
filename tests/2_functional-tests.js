const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

describe('Functional Tests', function () {
    describe("5 functional get request tests", function () {
        it("Viewing one stock: GET request to /api/stock-prices/", function (done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .set("content-type", "application/json")
                .query({ stock: "AAPL" })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, "AAPL");
                    assert.exists(res.body.stockData.price, "AAPL has a price");
                    done();
                });
        });

        it("Viewing one stock and liking it: GET request to /api/stock-prices/", function (done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .set("content-type", "application/json")
                .query({ stock: "GOOG", like: true })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, "GOOG");
                    assert.equal(res.body.stockData.likes, 1);
                    assert.exists(res.body.stockData.price, "GOOG has a price");
                    done();
                });
        });

        it("Viewing the same stock and liking it again: GET request to /api/stock-prices/", function (done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .set("content-type", "application/json")
                .query({ stock: "GOOG", like: true })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData.stock, "GOOG");
                    assert.equal(res.body.stockData.likes, 1);
                    assert.exists(res.body.stockData.price, "GOOG has a price");
                    done();
                });
        });

        it("Viewing two stocks: GET request to /api/stock-prices/", function (done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .set("content-type", "application/json")
                .query({ stock: ["MSFT", "T"] })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData[0].stock, "MSFT");
                    assert.equal(res.body.stockData[1].stock, "T");
                    assert.exists(res.body.stockData[0].price, "MSFT has a price");
                    assert.exists(res.body.stockData[1].price, "T has a price");
                    done();
                });
        });

        it("Viewing two stocks and liking them: GET request to /api/stock-prices/", function (done) {
            chai
                .request(server)
                .get("/api/stock-prices/")
                .set("content-type", "application/json")
                .query({ stock: ["MSFT", "T"], like: true })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.stockData[0].stock, "MSFT");
                    assert.equal(res.body.stockData[1].stock, "T");
                    assert.exists(res.body.stockData[0].price, "MSFT has a price");
                    assert.exists(res.body.stockData[1].price, "T has a price");
                    assert.exists(res.body.stockData[0].rel_likes, "has rel_likes");
                    assert.exists(res.body.stockData[1].rel_likes, "has rel_likes");
                    done();
                });
        });
    });
});