import ActionTypes from '../actions/ActionTypes';
import Immutable from 'immutable';

const DEFAULT = Immutable.Map();

export default function Lights(state = DEFAULT, action) {
  const { type, lights } = action;

  switch (type) {
    case ActionTypes.FETCH_LIGHTS_SUCCEEDED:
      return lights;
    default:
      return state;
  }
}