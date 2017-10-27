require('dotenv').config()
const express = require('express');
const request = require('request');
const Immutable = require('immutable');
const path = require('path');
const hueBridgeUrl = process.env.HUE_BRIDGE_URL;
const username = process.env.HUE_USERNAME;

function initializeLightList() {
  request(`${hueBridgeUrl}/api/${username}/lights`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    for (const [key, value] of Object.entries(body)) {
      hueLights = hueLights.set(key, Immutable.Map({
        name: value.name,
        id: key
      }));
    }
    hueLights.map((light, id) => {
      getLightStatus(id);
    });
  });
}

function updateLightList() {
  request(`${hueBridgeUrl}/api/${username}/lights`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    hueLights = hueLights.filter((light, id) => {
      return !!body[id];
    });
    for (const [key, value] of Object.entries(body)) {
      if (!hueLights.has(key)) {
        hueLights = hueLights.set(key, Immutable.Map({
          name: value.name,
          id: key
        }));
        getLightStatus(key);
      }
    }
      // check for change of state and print state update
  hueLights.map((light, id) => {
    updateLightStatus(id);
  });
  });

}

function getLightStatus(id) {
  request(`${hueBridgeUrl}/api/${username}/lights/${id}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    hueLights = hueLights.mergeIn(id, {
      brightness: body.state.bri,
      on: body.state.on,
    });
    // print out light objects
    console.log(JSON.stringify(hueLights.get(id), null, 2));
  });
}

function updateLightStatus(id) {
  request(`${hueBridgeUrl}/api/${username}/lights/${id}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    hasLightUpdated(body.state, id);
    hueLights = hueLights.mergeIn(id, {
      brightness: body.state.bri,
      on: body.state.on,
    });
  });
}

function hasLightUpdated(state, id) {
  const light = hueLights.get(id);
  if (light.get('brightness') !== state.bri) {
    console.log(JSON.stringify({
      id,
      brightness: state.bri
    }, null, 2));
  }
  if (light.get('on') !== state.on) {
    console.log(JSON.stringify({
      id,
      on: state.on
    }, null, 2));
  }
}



let hueLights = Immutable.Map();

// get list of lights
initializeLightList();

// while running 
setInterval(() => {
  // check for new lights, and removals of lights
  updateLightList();

}, 1500);

const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/lights', function (req, res) {
  res.send(hueLights.toJS());
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Philips Hue monitor is live on ${port}`);