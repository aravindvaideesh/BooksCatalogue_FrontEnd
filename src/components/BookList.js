import React from 'react';
//import Book from './Book';
import Hello from '../Hello';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class BookList extends React.Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      books: []
    }
  }

  componentDidMount() {
    const { location } = this.props;
    this.postUserDetails(location.state.detail);
    fetch(`http://localhost:3001/api/books`)
      .then(result => result.json())
      .then(books => this.setState({ books })) 
  }

  postUserDetails = (data) => {
    console.log('User ' + JSON.stringify(data, null, 3));
    return fetch('http://localhost:3001/api/FBUsers/replaceOrCreate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res;
    }).catch(err => err);
  }


  render() {
    return (
      <div>
      <Hello name={this.props.location.state.detail.name} />
      <BootstrapTable data={this.state.books} hover
        tableStyle={{ border: '#0000FF 2.5px solid' }}
        containerStyle={{ border: '#FFBB73 2.5px solid' }}
        headerStyle={{ border: 'red 1px solid' }}
        bodyStyle={{ border: 'green 1px solid' }}>
        <TableHeaderColumn width='150' isKey dataField='isbn'>ISBN</TableHeaderColumn>
        <TableHeaderColumn width='250' dataField='title'>Title</TableHeaderColumn>
        <TableHeaderColumn width='250' dataField='author'>Author</TableHeaderColumn>
        <TableHeaderColumn width='150' dataField='available'>Quantity</TableHeaderColumn>
      </BootstrapTable>
      </div>
    );
  }
}


export default withRouter(BookList);