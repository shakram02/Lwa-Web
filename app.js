const http = require('http');
const url = require('url');
const otpLib = require('otplib');
var fs = require('fs');
var path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

const secret = otpLib.authenticator.generateSecret();
const token = otpLib.authenticator.generate(secret);
const isValid = otpLib.authenticator.check(123456, secret);

const map = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword'
};

var HtmlData = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));

const server = http.createServer((req, res) => {
  if (req.method == 'GET') {
    serveGetRequest(req, res);
  } else {
    // FIXME: validation result is sent in the URL as I couldn't add it to
    // content and don't know how to parse it here
    var result = req.url.replace('/', '');

    if (result === 'true') {
      console.log('Validation OK');
    } else {
      console.error('Validation failed');
    }
    // var output = [];
    // for (var property in req) {
    //   console.log(property);
    //   console.log(req[property]);
    //   console.log();
    // }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


function parseContentType(filename) {
  const ext = path.parse(filename).ext;
  return map[ext] || 'text/html';
}

function serveGetRequest(req, res) {
  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  let pathname = `.${parsedUrl.pathname}`;

  // based on the URL path, extract the file extension. e.g. .js, .doc, ...
  const fileName = path.parse(path.basename(parsedUrl.pathname));

  // Index page requested
  if (fileName.name.length == 0) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(HtmlData);
    res.end();
    return;
  }

  try {
    // TODO: cache reads
    var data = fs.readFileSync(path.join(__dirname, 'public', fileName.base));
    res.setHeader('Content-Type', parseContentType(fileName.base));
    res.write(data);
    res.end();
  } catch (err) {
    // console.error(err);
    res.statusCode = 404;
    res.end(`File ${pathname} not found!`);
  }
}