var express = require('express');
var router = express.Router();
var axios = require('axios');
var fs = require('fs');

// var _authHeader;
var _authHeader = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleS1pZC0xIiwidHlwIjoiSldUIn0.eyJqdGkiOiJkMjBiY2VlZGQxZTM0MmI2ODgwNjVjNjc5M2E4NThjNSIsInN1YiI6ImYwNDJhNzYzLTBjNjEtNDc2Zi04MjcxLWJkYjkzM2U4YjM2NyIsInNjb3BlIjpbIm1kc3A6Y29yZTppb3QudHNhVXNlciIsIm1kc3A6Y29yZTppb3QudGltQWRtaW4iLCJtZHNwOmNvcmU6aW90LmZpbFVzZXIiLCJ0b2tlbmFwcC50b2tlbmFwcHNjb3BlIiwibWRzcDpjb3JlOmFuYWx5dGljcy51c2VyIiwibWRzcDpjb3JlOmFnbS5yZWFkb25seSIsIm1kc3A6Y29yZTptaW5kY29ubmVjdC5mdWxsYWNjZXNzIiwibWRzcDpjb3JlOm1zZy5mdWxsYWNjZXNzIiwibWRzcDpjb3JlOmVtLmV2ZW50Y3JlYXRvciIsIm1kc3A6Y29yZTphc3NldG1hbmFnZW1lbnQuc3RhbmRhcmR1c2VyIiwibWRzcDpjb3JlOmVtLmV2ZW50bWFuYWdlciIsIm1kc3A6Y29yZTp1dHMuYW5hbHlzdCJdLCJjbGllbnRfaWQiOiJ0b2tlbmFwcC1zb2xhcmMwMiIsImNpZCI6InRva2VuYXBwLXNvbGFyYzAyIiwiYXpwIjoidG9rZW5hcHAtc29sYXJjMDIiLCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwidXNlcl9pZCI6ImYwNDJhNzYzLTBjNjEtNDc2Zi04MjcxLWJkYjkzM2U4YjM2NyIsIm9yaWdpbiI6InNvbGFyYzAyIiwidXNlcl9uYW1lIjoic29sYXJjLWhhY2thdGhvbnMtMTNAbWluZHNwaGVyZS5pbyIsImVtYWlsIjoic29sYXJjLWhhY2thdGhvbnMtMTNAbWluZHNwaGVyZS5pbyIsImF1dGhfdGltZSI6MTUyNzI3MTM4OCwicmV2X3NpZyI6ImJkZjQ2MDhhIiwiaWF0IjoxNTI3MjcxMzg4LCJleHAiOjE1MjcyNzMxODgsImlzcyI6Imh0dHBzOi8vc29sYXJjMDIucGlhbS5ldTEubWluZHNwaGVyZS5pby9vYXV0aC90b2tlbiIsInppZCI6InNvbGFyYzAyIiwiYXVkIjpbIm1kc3A6Y29yZTppb3QiLCJtZHNwOmNvcmU6bWluZGNvbm5lY3QiLCJtZHNwOmNvcmU6YW5hbHl0aWNzIiwibWRzcDpjb3JlOmFzc2V0bWFuYWdlbWVudCIsIm1kc3A6Y29yZTptc2ciLCJtZHNwOmNvcmU6dXRzIiwidG9rZW5hcHAtc29sYXJjMDIiLCJtZHNwOmNvcmU6YWdtIiwidG9rZW5hcHAiLCJtZHNwOmNvcmU6ZW0iXSwidGVuIjoic29sYXJjMDIiLCJzY2hlbWFzIjpbInVybjpzaWVtZW5zOm1pbmRzcGhlcmU6aWFtOnYxIl0sImNhdCI6InVzZXItdG9rZW46djEifQ.PWWltypWXsi2zNJvR1Ry1_I4ZONaaxo3EjrfSWfo0H2fEOslmRRMDFWTvDm92gJuqJVSQADj76Otq65GpwT83vvEX9UIclCT27tJqqSAkAtf5kcWlxt9Mety8P1-yQm3VVGwwklg5TKfVzmkGfOOUhcMT9uB2x23QeIc8FLlAlBrKEmXw8fbDSkV10gR8SLUvDabk8JYlkCQYLhAX4MltZ9qUYkswv9XgA8SKoGwpP6Y9ovMorGu3CVkl9siw8LFUIWBgsNb_yxmW0grYW4RJm0g1e06pfznuANbmDCltReqoT0-saDuyKHSohf0KQ5RM3AYJkN9ImFPg_NHSfwgag";

var alarmFileName = __dirname + '/alarm-definitions.json';

const instance = axios.create({
  headers: {'Authorization': 'Bearer ' + _authHeader},
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
  request
  .get('https://gateway.eu1.mindsphere.io/api/identitymanagement/v3/Users')
  .set('Authorization', _authHeader)
  .set('Accept', 'application/json')
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
