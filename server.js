const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');

const app = express();

app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

app.use(
  express.static(distPath, {
    index: false,
    maxAge: '1h'
  })
);

app.get('/env.js', (req, res) => {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
  res.setHeader('content-type', 'application/javascript; charset=utf-8');
  res.setHeader('cache-control', 'no-store, max-age=0');
  res.status(200).send(`window.__ENV__ = Object.assign(window.__ENV__ || {}, { REACT_APP_API_BASE_URL: ${JSON.stringify(apiBaseUrl)} });`);
});

app.get('*', (req, res) => {
  if (!fs.existsSync(indexHtmlPath)) {
    res
      .status(500)
      .type('text/plain')
      .send(
        'Build output not found. Ensure `npm run build` ran and produced dist/index.html.'
      );
    return;
  }

  res.sendFile(indexHtmlPath);
});

const port = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});

