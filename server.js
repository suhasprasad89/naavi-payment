const http = require('http');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'payments.json');
const CLIENT_DIR = path.join(__dirname, 'client');

function readPayments() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writePayments(payments) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(payments, null, 2));
}

function sendJson(res, data) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveFile(res, filePath, contentType='text/html') {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/api/payments') {
    return sendJson(res, readPayments());
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/payments') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const payments = readPayments();
        const payment = {
          id: randomUUID(),
          parentName: data.parentName,
          studentName: data.studentName,
          studentId: data.studentId,
          amount: data.amount,
          timestamp: new Date().toISOString(),
        };
        payments.push(payment);
        writePayments(payments);
        sendJson(res, payment);
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return;
  }

  // serve static files
  let filePath = parsedUrl.pathname === '/' ? '/index.html' : parsedUrl.pathname;
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'text/html';
  if (ext === '.js' || ext === '.jsx') contentType = 'application/javascript';
  if (ext === '.css') contentType = 'text/css';

  filePath = path.join(CLIENT_DIR, filePath);
  serveFile(res, filePath, contentType);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
