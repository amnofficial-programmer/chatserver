const https = require('https');
const fs = require('fs');

const options = {
    cert: fs.readFileSync('./ssl/tier1jobs_in.crt'),
    key: fs.readFileSync('./ssl/tie1jobs_privkey.key')
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);