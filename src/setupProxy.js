const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.sheetbest.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/sheets/0193b11b-d499-4c08-a3a2-d562a388086c'
      }
    })
  );
}; 