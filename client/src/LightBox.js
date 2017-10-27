import React, { Component } from 'react';
import PropTypes from 'proptypes';
import Immutable from 'immutable';

class LightBox extends Component {

  render() {
    const { light } = this.props;
    const status = light.get('on') ? 'Light is on' : 'Light is off';
    return (
      <div className='lightbox'>
        <h2>{light.get('name')}</h2>
        <h2>{status}</h2>
        <h2>{`Current brightness: ${light.get('brightness')}`}</h2>
      </div>
    );
  }
}

LightBox.propTypes = {
  light: PropTypes.instanceOf(Immutable.Map).isRequired,
}

export default LightBox;