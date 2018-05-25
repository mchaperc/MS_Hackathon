var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs');

var _authHeader;

var alarmFileName = __dirname + '/alarm-definitions.json';

const instance = axios.create({
  headers: {'Authorization': _authHeader},
});

router.get('/getEvents', function(req, res, next) {
  getEvents()
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      res.send(error);
    });
});

router.get('/getAlarms', function(req, res, next) {
  fs.readFile(alarmFileName, 'utf8', (err, response) => {
    console.log(response);
    res.send(response);
  });
});

router.post('/addAlarm', function(req, res, next) {
  var existingAlarms = [];
  if (fs.existsSync(alarmFileName)) {
    existingAlarms = fs.readFileSync(alarmFileName, 'utf8');
  }
  if (req && req.body && req.body.length) {
    req.body.forEach((alarm) => {
      existingAlarms.push(alarm);
    });
  }
  fs.writeFile(alarmFileName, JSON.stringify(existingAlarms), () => {
    res.send('Successfully added');
  });
});


router.get('/ping', function (req, res) {
  _authHeader = req.get('authorization')
});

  // call a mindsphere api
function getTimeSeries(){
  instance
  .get('https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users')
  .then(function (data) {
    res.json({
      resources: data.body.resources
    });
  })
  .catch(err => {
    console.error(err.message, err.status);
    res.status(err.status).json({ message: 'Failed to fetch users.' });
  });
}

function getEvents(filterParams) {
  return new Promise((resolve, reject) => {
    var eventUrl = "https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events";

    var eventsToBeStored = [];

    var eventList = [];

    // Create request to get events
    instance.get(eventUrl)
      .then((response) => {
        if (response.status === 200) {
            var data = response['data'];
            if (data['_embedded'] && data['_embedded']['events']) {
                eventList = [...data['_embedded']['events']];
            }
          var promises = eventList.map((event) => {
            return getEventDetails(event)
              .then((result) => {
                return result;
              })
              .catch((err) => {
                console.log('err: ', err);
              });
          });

          resolve(Promise.all(promises).then((results) => results));
        }
        else {
            console.error('Request status text: ' + response.statusText);
        }
        console.log(eventList);
      })
      .catch((err) => {
        console.log('error: ', err);
      });
  });
}

function getEventDetails(event) {
  // Get Event Details
  return new Promise((resolve, reject) => {
    var eventUrl = 'https://gateway.eu1.mindsphere.io/api/eventmanagement/v3/events/' + event.id;
    instance.get(eventUrl)
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.log('err: ', err);
        reject(err);
      });
  });
}

module.exports = router;
