require('dotenv').config();

var request = require('request');
var rOwner = process.argv[2];
var rName = process.argv[3];

console.log('Welcome to the Github Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      'Authorization': 'Bearer ' + process.env.GITHUB_TOKEN
    },
  }
  request(options, function(err, res, body) { // create request for data from url path
    console.log(res.headers);                 //
    cb(err, JSON.parse(body));                // parse the data and pass into cb to use
  });
}

function downloadImageByURL(url, filePath) {
  var fs = require('fs');

  request.get(url)
         .on('error', function(err) { // error handling in case response is an error
            console.log('An error has occured while requesting from the page.');
         })
         .on('response', function(response) { // show once a response is received
            console.log('Response Status Code: ', response.statusCode);
            console.log('Response message: ', response.statusMessage);
            console.log('Content Type: ', response.headers['content-type']);
         })
         .on('data', function(response) {
            console.log('Downloading image...');
         })
         .on('end', function(response) {
            console.log('Download Complete'); // prompt once data has been downloaded
         })
         .pipe(fs.createWriteStream(filePath)); // write to specified filepath
}

// only runs the repo request if repo name and repo owner are specified in command line
if(rOwner && rName) {
  getRepoContributors(rOwner, rName, function(err, result) {
    console.log("Errors:", err); // logs any errors from request
    result.forEach(function(elm) {
      var url = elm.avatar_url;
      var path = './avatar/' + elm.login + '.jpg';
      downloadImageByURL(url, path);
    })
  });
} else {
  console.log("Error! Please specify both the repository's owner and name");
  console.log("Program will now terminate");
}

