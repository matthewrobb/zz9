var request = require('request');
var fs = require('fs');

var download = function(url, path) {
  request(url).pipe(fs.createWriteStream(path));
}

module.exports = download;
