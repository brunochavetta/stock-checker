const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

describe('Functional Tests', function () {
    it('Ver una acción: GET /api/stock-prices', function (done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: 'AAPL' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'stock');
                assert.property(res.body, 'price');
                assert.property(res.body, 'likes');
                done();
            });
    });

    it('Ver una acción y gustarle: GET /api/stock-prices?like=true', function (done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: 'GOOG', like: true })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'likes');
                assert.isAbove(res.body.likes, 0);
                done();
            });
    });

    it('Ver el mismo stock y gustarlo de nuevo', function (done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: 'GOOG', like: true })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'likes');
                done();
            });
    });

    it('Ver dos acciones: GET /api/stock-prices', function (done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: ['MSFT', 'AAPL'] })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.property(res.body, 'stockData');
                assert.isArray(res.body.stockData);
                done();
            });
    });

    it('Ver dos acciones y gustarles: GET /api/stock-prices', function (done) {
        chai.request(server)
            .get('/api/stock-prices')
            .query({ stock: ['MSFT', 'AAPL'], like: true })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body.stockData);
                assert.property(res.body.stockData[0], 'rel_likes');
                done();
            });
    });
});