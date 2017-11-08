import React from 'react';

export default class Book extends React.Component {
  renderDetails(key, label) {
    if (this.props[key]) {
      return (<td className="detail">{this.props[key]}</td>);
    }
  }

  render() {
    return (
      <tr>
       <td><img alt='' src={this.props.imagePath} align="left" width="60" height="60" /></td>
        {this.renderDetails('title', 'Title:')}
        {this.renderDetails('author', 'Author:')}
        {this.renderDetails('available', 'Quanity Available:')}
      </tr>
    );
  }
}