var request = require('request');
var token = require('./secrets.js')

console.log('Welcome to the Github Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + '/contributors',
    headers: {
      'User-Agent': 'request'
    },
    Authorization: token
  }
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  var fs = require('fs');

  request.get(url)
         .on('error', function(err) {
            console.log('An error has occured while requesting from the page.');
         })
         .on('response', function(response) {
          console.log('Response Status Code: ', response.statusCode);
          console.log('Response message: ', response.statusMessage);
          console.log('Content Type: ', response.headers['content-type']);
          console.log('Downloading image...');
         })
         .on('end', function(response) {
          console.log('Download Complete');
         })
         .pipe(fs.createWriteStream(filePath));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result.forEach(function(elm) {
    var url = elm.avatar_url;
    var path = './avatar/' + elm.login + '.jpg';
    downloadImageByURL(url, path);
  })
});

downloadImageByURL('https://avatars1.githubusercontent.com/u/43004?v=4', './avatar/test.jpg');

