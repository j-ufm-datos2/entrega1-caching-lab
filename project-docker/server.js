// Import the installed modules.
const express = require('express');
const responseTime = require('response-time');
const axios = require('axios');
const redis = require('redis');
var influx = require('influx_conection')
var CONFIG = require('./config.json');

const client = redis.createClient(process.env.REDIS_URL);

const influx_c = influx.influx;

const app = express();

app.use(responseTime());

app.get(CONFIG.apis.redis_search, (req, res) => {
  // Extract the query from url and trim trailing spaces
  const query = (req.query.query).trim();
  const start = Date.now();
  const searchUrl = CONFIG.apis.api_url;
  // Try fetching the result from Redis first in case we have it cached
  return client.get(`github:${query}`, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      const resultJSON = JSON.parse(result);
      const duration = Date.now() - start;
      console.log(duration);
      resultJSON.response_time = duration;
      influx_c.saveRequestInflux(resultJSON);
      return res.status(200).json(resultJSON);
    } else {
      // Fetch directly from API
      return axios.get(searchUrl)
        .then(response => {
          const duration = Date.now() - start;
          console.log(duration);
          const responseJSON = response.data;
          // Save API response in Redis
          client.setex(`github:${query}`, 3600, JSON.stringify({query: `${query}`, source: 'Redis Cache', ...responseJSON, }));
          // Send JSON
          influx_c.saveRequestInflux({response_time: duration, query: `${query}`, source: 'Github API', ...responseJSON, });
          //console.log(to_influx);
          return res.status(200).json({response_time: duration, query: `${query}`, source: 'Github API', ...responseJSON, });
        })
        .catch(err => {
          return res.json(err);
        });
    }
  });
});