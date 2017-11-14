import React from 'react';
import Hello from '../Hello';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, ButtonToolbar, OverlayTrigger, Popover, FormControl, Alert } from 'react-bootstrap';
import _ from 'lodash';

class BookList extends React.Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      books: [],
      userBooks: [],
      user: {},
      input: '',
      alertVisible: false,
      successAlert: false,
      displayUserBooks: false
    }
  }

  componentDidMount() {
    const { location } = this.props;
    this.postUserDetails(location.state.detail);
    this.fetchBooks();
  }

  fetchBooks = () => {
    fetch(`http://localhost:3001/api/books`)
      .then(result => result.json())
      .then(books => this.setState({ books }))
  }

  postUserDetails = (data) => {
     fetch('http://localhost:3001/api/FBUsers/replaceOrCreate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => result.json())
      .then(user => {
        this.setState({ user })
        this.getUserBooks();
      })
      .catch(err => err);
  };

  handleChange = (e) => {
    this.setState({ input: e.target.value})
  }

  addToUserBooks = () => {
     let isbn = this.state.input;
     let selectedBook = _.find(this.state.books, (book) => {
      return book.isbn == isbn;
     })

     let index = _.findIndex(this.state.userBooks, (book) => {
      return book.isbn == isbn;
     })

     if(selectedBook && selectedBook.available > 0 && index === -1) {
      fetch('http://localhost:3001/api/UserBooks', {
        method: 'POST',
        body: JSON.stringify({userId: this.state.user.userId, bookId: selectedBook.id}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => result.json())
      .then(book => {
        this.setState({ successAlert : true});
        this.fetchBooks();
        this.getUserBooks();
      })
      .catch(err => err);
     } else {
      this.setState({ alertVisible: true });
     }
  }

  getUserBooks = () => {
    fetch('http://localhost:3001/api/UserBooks?filter[where][userId]=' + this.state.user.userId)
      .then(result => result.json())
      .then(userBooks => this.setState({ userBooks }))
  }

  handleAlertDismiss = () => {
    this.setState({ alertVisible: false });
    this.setState({ successAlert: false });
  }

  toggleBooks = () => {
    this.setState({displayUserBooks: !this.state.displayUserBooks });
  }

  goToBookCreation = () => {
    this.props.history.push('/createBook');
  }

  renderAlert() {
    if (this.state.alertVisible) {
        return(
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
        <h4>Oops! Book cannot be added</h4>
        </Alert>
       );
      }
   }

   renderSuccessAlert() {
    if (this.state.successAlert) {
        return(
        <Alert bsStyle="success" onDismiss={this.handleAlertDismiss}>
        <h4>Book successfully added</h4>
        </Alert>
       );
      }
   }

  render() {

  const popoverClick = (
  <Popover id="popover-trigger-click" title="Add Book">
    <strong>Enter ISBN!</strong>
     <FormControl
            type="text"
            placeholder="ISBN"
            onChange={this.handleChange}
          />
      <Button bsStyle="primary" bsSize="small" onClick={this.addToUserBooks}>ADD</Button>
      {this.renderSuccessAlert()}
      {this.renderAlert()}
  </Popover>
  );

  let buttonText;
  if(this.state.displayUserBooks) {
    buttonText = 'SHOW CATALOGUE';
  } else {
    buttonText = 'MY BOOKS';
  }

    return (
      <div>
      <Hello name={this.props.location.state.detail.name} />
      <BootstrapTable data={this.state.displayUserBooks ? this.state.userBooks : this.state.books} hover
        tableStyle={{ border: '#0000FF 2.5px solid' }}
        containerStyle={{ border: '#FFBB73 2.5px solid' }}
        headerStyle={{ border: 'red 1px solid' }}
        bodyStyle={{ border: 'green 1px solid' }}>
        <TableHeaderColumn width='150' isKey dataField='isbn'>ISBN</TableHeaderColumn>
        <TableHeaderColumn width='250' dataField='title'>Title</TableHeaderColumn>
        <TableHeaderColumn width='250' dataField='author'>Author</TableHeaderColumn>
        <TableHeaderColumn width='150' dataField='available'>Quantity</TableHeaderColumn>
      </BootstrapTable>
      <ButtonToolbar>
      <Button bsStyle="primary" onClick={this.toggleBooks}>{buttonText}</Button>
      <OverlayTrigger trigger="click" placement="bottom" overlay={popoverClick}>
      <Button bsStyle="primary" disabled={this.state.displayUserBooks}>ADD TO MY BOOKS</Button>
      </OverlayTrigger>
      <Button bsStyle="primary" onClick={this.goToBookCreation}>ADD BOOKS TO CATALOGUE</Button>
      </ButtonToolbar>
      </div>
    );
  }
}


export default withRouter(BookList);