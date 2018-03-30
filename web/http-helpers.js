

var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
var request = require('request');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {

 fs.readFile(path.join(archive.paths.siteAssets, asset), 'utf-8', function(err, data) {
    if (!data) {
      fs.readFile(path.join(archive.paths.archivedSites, asset), 'utf-8', function(err, data) {
        if (!data) {
          exports.sendResponse(res, '404: Page not found', 404);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
 });
};

exports.sendResponse = function(res, asset, statusCode) {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, exports.headers);
  res.end(asset);
};

exports.getData = function(req, callback) {
  var data = '';
  req.on('data', function(chunk) {
    data += chunk;
  });
  req.on('end', function() {
    callback(data);
  });
};

// exports.makeActionHandler = function(actionMap) {
//   return function(req, res) {
//     var action = actionMap[req.method];
//     if (action) {
//       action(req, res);
//     } else {
//       exports.sendResponse(res, '', 404);
//     }
//   };
// };

// exports.sendRedirect = function(res, location, status) {
//   status = status || 302;
//   res.writeHead(status, {Location: location});
//   res.end();
// };
