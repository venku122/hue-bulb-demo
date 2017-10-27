import ActionTypes from './ActionTypes';
import Immutable from 'immutable';
import Axios from 'axios';

export function fetchLights() {
  console.log('fetch lights called');
  return dispatch => {
    dispatch({
      type: ActionTypes.FETCH_LIGHTS_ATTEMPTED
    });
    Axios.get('/lights')
    .then((response) => {
      dispatch({
        type: ActionTypes.FETCH_LIGHTS_SUCCEEDED,
        lights: Immutable.fromJS(response.data)
      });
    })
  };
}