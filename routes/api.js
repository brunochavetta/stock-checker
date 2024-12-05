'use strict';
const fetch = require('node-fetch');
const crypto = require('crypto');

let stockData = {}; // Para almacenar datos de acciones y likes

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      try {
        const stocks = [].concat(req.query.stock); // Aceptar 1 o 2 acciones
        const like = req.query.like === 'true';
        const ipHash = crypto.createHash('sha256').update(req.ip).digest('hex');

        const results = await Promise.all(stocks.map(async (symbol) => {
          const response = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
          const stockInfo = await response.json();

          if (!stockInfo.symbol) throw new Error('Invalid stock symbol');

          // Inicializar datos si no existen
          if (!stockData[symbol]) stockData[symbol] = { likes: new Set() };

          // Procesar likes
          if (like) stockData[symbol].likes.add(ipHash);

          return {
            stock: stockInfo.symbol,
            price: stockInfo.latestPrice,
            likes: stockData[symbol].likes.size
          };
        }));

        // Devolver resultados
        if (results.length === 1) {
          res.json({ stockData: results[0] });
        } else {
          res.json({
            stockData: results.map((result) => ({
              stock: result.stock,
              price: result.price,
              rel_likes: result.likes - results.find(r => r.stock !== result.stock).likes
            }))
          });
        }        
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
};
