const Influx = require('influx');
var CONFIG = require('./config.json');

const influx = new Influx.InfluxDB({
    host: CONFIG.influx.host,
    database: CONFIG.influx.database,
    schema: [
      {
        measurement: CONFIG.influx.measurement,
        fields: {
          response_time: Influx.FieldType.FLOAT,
          source: Influx.FieldType.STRING,
          query: Influx.FieldType.STRING,
          raw: Influx.FieldType.STRING
        },
        tags: CONFIG.influx.tags
      }
    ]
});

function saveRequestInflux(result) {

  influx.writePoints([
    {
      measurement: 'response_times',
      tags: { host: 'api' },
      fields: {
        response_time: result.response_time,
        source: result.source,
        query: result.query,
        raw: JSON.stringify(result.items)
      }
    }
  ]).catch(err => {
    console.error(`Error saving data to InfluxDB! ${err.stack}`)
  });
}

influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('express_response_db')) {
      return influx.createDatabase('express_response_db')
    }
  })
  .then(() => {
    app.listen(CONFIG.influx.port, function () {
      console.log('Listening on port 3000')
    })
  })
  .catch(err => {
    console.error(`Error creating Influx database!`)
  });


module.exports = {influx, saveRequestInflux}