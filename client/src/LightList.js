import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { connect} from 'react-redux';
import Immutable from 'immutable';
import { fetchLights } from './actions/Lights';
import LightBox from './LightBox';

class LightList extends Component {
  constructor(props) {
    super(props);
    props.fetchHueLights();
  }

  renderRefresh() {
    const { fetchHueLights } = this.props;
    return (
      <div className="refresh-button" onClick={fetchHueLights}>
          Refresh light information
      </div>
    );
  }

  renderLights() {
    const { lights } = this.props;
    if (lights.size < 1) {
      return (
        <h3>No lights are connected</h3>
      );
    }
    return (lights.toArray().map((light, index) => {
      return (<LightBox light={light} key={index} />);
    }))
  }

  render() {
    return (
      <div className='lightlist'>
        {this.renderRefresh()}
        {this.renderLights()}
      </div>
    );
  }
}

LightList.propTypes = {
  fetchHueLights: PropTypes.func.isRequired,
  lights: PropTypes.instanceOf(Immutable.Map).isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    lights: state.lights,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchHueLights: () => {
      dispatch(fetchLights())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LightList);