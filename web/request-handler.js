var path = require('path');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
var path = require('path');
var helpers = require('./http-helpers.js');
var url = require('url');

var actions = {
  GET: function(req, res) {
    // var path =  url.parse(req.url).pathname;
    // if (path === '/') {
    //   path = '/index.html';
    // };
    // helpers.serveAssets(res, path, function() {
    //   if (path[0] === '/') {
    //     path = path.slice(1);
    //   } 
    //   archive.isUrlInList(path, function(inList) {
    //     if (inList) {
    //       helpers.sendResponse(res, '/loading.html')
    //     } else {
    //       helpers.sendResponse(res, '404: Page not found', 404);
    //     }
    //   });
    // });
    helpers.serveAssets(res, '/index.html', null);
  },

  POST: function(req, res) {
    console.log('hellooooo')
    helpers.getData(req, function(data) {
      var url = data.split('=')[1].toString();
      archive.isUrlInList(url, function(inList) {
        if (inList) {
          archive.isUrlArchived(url, function(inArchive) {
            if (inArchive) {
              helpers.serveAssets(res, '/' + url, null);
            } else {
              archive.downloadUrls([url]);
              helpers.serveAssets(res, '/loading.html', null)
            }
          });
        } else {
            console.log('hello')
            archive.addUrlToList(url);
            archive.downloadUrls([url]);
            helpers.serveAssets(res, '/loading.html', null);
        }
      });

    });
  }
}

// exports.handleRequest = function (req, res) {
//   res.end(archive.paths.list);
// };

exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if(action) {
    console.log(action)
    action(req, res);
  } else {
    helpers.sendResponse(res, '404: Page not found', 404)
  }
  //res.end(archive.paths.list);
};