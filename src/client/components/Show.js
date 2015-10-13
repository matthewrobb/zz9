import React, { Component, PropTypes } from 'react';

export default class Show extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.name}</td>
        <td>{this.props.network || 'unknown'}</td>
        <td>{this.props.settings.quality}</td>
        <td>{this.props.name}</td>
        <td>WIP</td>
      </tr>
    );
  }
}

Show.propTypes = {
  name: PropTypes.string.isRequired
};
