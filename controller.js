'use strict';

const url = require('url');
const validUrl = require('valid-url');
const dns = require('dns');
const urlModel = require('./model.js');

exports.shortenUrl = (req, res) => {
  let passedUrl = req.body.url;
  // "www.example.com/test/" and "www.example.com/test" are the same URL
  if (passedUrl.endsWith('/')) passedUrl = passedUrl.slice(0,-1);
  // Case 1: user passes a URL that doesn't follow the http(s)://www.example.com(/more/routes) format
  if (!validUrl.isWebUri(passedUrl)) {
    res.json({"error": "invalid URL"});
  }
  else {
    dns.lookup(url.parse(passedUrl).hostname.replace(/^www\./, ''), error => {
      // Case 2: user passes an invalid URL
      if (error) res.json({"error": "invalid URL"});
      // URL is valid
      else {
        // Check if URL is already stored in the DB
        urlModel.findOne({"original_url": passedUrl}, (error, data) => {
          if (error) return error;
          // Case 3: URL is already in the DB -> return the matched one  
          if (data) {
            res.json({"original_url": data.original_url, "short_url": data.short_url});
          }
          // Case 4: URL is NOT in the DB -> create short URL and return it
          else {
            urlModel.find({}, (error, data) => {
              if (error) return error;
              const newRecordJson = {"original_url": passedUrl, "short_url": data.length + 1};
              const newRecord = new urlModel(newRecordJson);
              newRecord.save(error => {
                if (error) return error;
                res.json(newRecordJson);
              });
            });
          }
        });
      }
    });
  }
};


exports.redirectFromShortToOriginalUrl = (req, res) => {
  const shortUrl = req.params.shurl;
  if (!parseInt(shortUrl, 10)) {
    res.json({"error": "Wrong format"});
  } else {
    urlModel.findOne({"short_url": shortUrl}, (error, data) => {
      if (error) return error; 
      if (data) {
        res.redirect(data.original_url);
      } else {
        res.json({"error": "No short url found for given input"});
      }
    });
  }
};