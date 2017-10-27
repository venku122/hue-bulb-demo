const express = require('express');
const request = require('request');
const Immutable = require('immutable');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
})

function getLights() {
  console.log('requesting status of all lights');
  request('http://localhost:5000/api/newdeveloper/lights', { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }

    for (const [key, value] of Object.entries(body)) {
      if (!hueLights.has(key)) {
        hueLights = hueLights.set(key, Immutable.Map({
          name: value.name,
          id: key
        }));
        getLightStatus(key);
      }
    }
  });
}

function getLightStatus(id) {
  console.log(`Requesting status of light: ${id}`);
  request(`http://localhost:5000/api/newdeveloper/lights/${id}`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    hasLightUpdated(body.state, id)
    hueLights = hueLights.mergeIn(id, {
      brightness: body.state.bri,
      on: body.state.on,
    });
  });
}

function hasLightUpdated(state, id) {
  const light = hueLights.get(id);
  let shouldUpdate = false;
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

function printLightList() {
  hueLights.map(light => {
    console.log(JSON.stringify(light, null, 2));
  }) 
}

function printLight(id) {
  console.log(JSON.stringify(hueLights.get(id), null, 2));
}

let hueLights = Immutable.Map();

setInterval(() => {
  getLights();
  hueLights.map((light, id) => {
    getLightStatus(id);
  });
}, 1500);


const port = process.env.PORT || 3000;
app.listen(port);

console.log(`Philips Hue monitor is live on ${port}`);