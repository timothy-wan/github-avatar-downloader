// the folder to store images to does not exist
// an incorrect number of arguments given to program (0, 1, 3, etc.)
// the provided owner/repo does not exist
// the .env file is missing
// the .env file is missing information
// the .env file contains incorrect credentials
var envCheck = require('dotenv').config();
var fs = require('fs');
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
    console.log(res.headers);
    if(res.statusCode === 404) {
      console.log('Entered repo owner/name does not exist!'); //404 response unavailable
    } else if(res.statusCode === 401){
      console.log('Unauthorized access, your GITHUB_TOKEN is not properly configured!'); //unauthorized so key isnt set
    } else if(res.statusCode === 200) {
      cb(err, JSON.parse(body)); // parse the data and pass into cb to use
    }
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function(err) { // error handling in case response is an error
            console.log('An error has occured while requesting from the page.');
          })
         .on('response', function(response) { // show once a response is received
            console.log('Response message: ', response.statusMessage);
          })
         .on('end', function(response) {
            console.log('Download Complete'); // prompt once data has been downloaded
          })
         .pipe(fs.createWriteStream(filePath)); // write to specified filepath
}



if(envCheck.error) { //if .env doesn't exist
  console.log('Please create your .env file before continuing');
} else if(!envCheck.parsed.GITHUB_TOKEN) { //make sure GITHUB_TOKEN key is created
  console.log("Please set your GITHUB_TOKEN in your .env");
} else {
  if(rOwner && rName) { // only runs the repo request if repo name and repo owner are specified in command line
    getRepoContributors(rOwner, rName, function(err, result) {
      if(err === null) {
        result.forEach(function(elm) {
          var url = elm.avatar_url;
          var path = './avatar/' + elm.login + '.jpg';
          if(fs.existsSync(path)) {
            downloadImageByURL(url, path);
          } else {
            console.error('File path does not exist, please fix!');
          }
        });
      }
    });
  } else {
    console.log("Error! Please specify both the repository's owner and name");
    console.log("Program will now terminate");
  }
}



