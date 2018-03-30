var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Promise = require('bluebird');
var helpers = require('../web/http-helpers.js');
var http = require('http');
var request = require('request')

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// exports.readListOfUrls = function(callback) {
//   return new Promise(function(resolve, reject) {
//     fs.readFile(exports.paths.list, 'utf8', function(err, data) {
//       if (!data) {
//         reject(err)
//       } else {
//         data = data.toString().split('\n');
//         resolve(data);
//       }
//     });
//   })
// };

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (!data) {
      console.log(err)
    }
    data = data.toString().split('\n');
    callback(data);
  });
};

exports.readListOfUrlsAsync = Promise.promisify(exports.readListOfUrls);

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(data) {
    callback(_.contains(data, url))
  });
};

exports.isUrlInListAsync = Promise.promisify(exports.isUrlInList);

exports.addUrlToList = function(url) {
  // fs.createWriteStream(exports.paths.list, {flags: 'a'}).write(url + '\n');
  // callback();

  fs.appendFile(exports.paths.list,  url + '\n', function(err){
    if(err){
      console.log('ERROR: ' + err);
    }
    // callback();
  });
};

exports.addUrlToListAsync = Promise.promisify(exports.addUrlToList);

exports.isUrlArchived = function(url, callback) {
  fs.readdir(exports.paths.archivedSites, function(err, data) {
    callback(_.contains(data, url));
  });
};

exports.isUrlArchivedAsync = Promise.promisify(exports.isUrlArchived);

exports.downloadUrls = function(urls) {
  urls.forEach(function(url) {
    request('http://' + url).pipe(fs.createWriteStream(path.join(exports.paths.archivedSites, '/', url)));
  });
};

exports.downloadUrlsAsync = Promise.promisify(exports.downloadUrls);