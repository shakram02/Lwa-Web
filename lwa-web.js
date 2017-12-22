const http = require('http');
const url = require('url');
const otpLib = require('otplib');
const five = require('johnny-five');

var fs = require('fs');
var path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

var secret = {};
// const token = otpLib.authenticator.generate(secret);
// const isValid = otpLib.authenticator.check(123456, secret);

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

var RequestType =
    Object.freeze({GetSecret: 'get-secret', CreateKey: 'get-key'});

var HtmlData = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));

var board = new five.Board({repl: false});
const RED_LED_PIN = 10;
const GREEN_LED_PIN = 8;
const LED_ON_INTERVAL_MS = 1200;

var redLed = undefined;
var greenLed = undefined;

const server = http.createServer((req, res) => {

  if (req.method == 'GET') {
    serveGetRequest(req, res);
  } else if (req.method == 'POST') {
    servePostRequest(req, res);
  } else {
    res.statusCode = 404;
    res.end();
  }
});


// The board's pins will not be accessible until
// the board has reported that it is ready
board.on('ready', function() {
  console.log('Ready!');
  redLed = new five.Led(RED_LED_PIN);
  greenLed = new five.Led(GREEN_LED_PIN);
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
  } else if (handleSpecialFunction(fileName.name, res)) {
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

function servePostRequest(req, res) {
  var body = '';

  req.on('data', function(data) {
    body += data;
  });

  req.on('end', function(data) {
    var parsedData = JSON.parse(body);

    if (otpLib.authenticator.check(parseInt(parsedData.inputValue), secret)) {
      turnLedOnFor(greenLed, LED_ON_INTERVAL_MS);
      res.end('ok');
    } else {
      turnLedOnFor(redLed, LED_ON_INTERVAL_MS);
      res.end('invalid');
    }

  });
}

function handleSpecialFunction(reqUrl, res) {
  if (reqUrl == RequestType.GetSecret) {
    // TODO: encrypt it, LOL!
    // secret = otpLib.authenticator.generateSecret()
    secret = 'aaabbbcccdddeeefff';
    res.end(secret);
  } else {
    return false;
  }

  res.end();
  return true;
}

function turnLedOnFor(led, ms) {
  if (led == undefined) {
    console.error('LED isn\'t initialized');
    return;
  }

  led.on();
  setInterval(() => {
    led.off();
  }, ms);
}
