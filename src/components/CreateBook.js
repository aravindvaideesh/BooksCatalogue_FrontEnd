import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button, ButtonToolbar, form, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';

class CreateBook extends React.Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      isbn: '',
      author: '',
      available: '',
      success: false,
      showAlert: false
    }
  }

  onInputChange = (e) => {
    const state = this.state,
          name = e.target.name,
          value = e.target.value;
    
    state[name] = value;

    this.setState(state);
  }

  submitBookCreation = () => {
    fetch('http://localhost:3001/api/books', {
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => result.json())
      .then(book => {
        if(book.hasOwnProperty('error')) {
          this.setState({ showAlert : true, success: false});
        } else {
          this.setState({ showAlert : true, success: true});
        }
        this.setDefaultValues();
      })
      .catch(err => {
        this.setState({ showAlert : true, success: false});
      });
  }

  setDefaultValues = () => {
    this.setState({ title: '', isbn: '', author: '', available: ''});
  }

  renderAlert() {
    if (this.state.showAlert) {
        return(
        <Alert bsStyle={this.state.success ? "success": "danger"} onDismiss={this.handleAlertDismiss}>
        {this.state.success ? <h4>Book successfully created</h4> : <h4>Failed to create book</h4>} 
        </Alert>
       );
      }
   }

   handleAlertDismiss = () => {
    this.setState({ showAlert : false});
   }

   goHome = () => {
    this.props.history.push('/');
   }


  render() {

    const { title, isbn, author, available } = this.state;
    let isFormInvalid = false;

    if( title === '' || isbn === '' || author === '' || available === '') {
      isFormInvalid = true;
    }

    return (
     <form>
    <FormGroup>
      <ControlLabel>ISBN</ControlLabel>
      <FormControl type="text" name="isbn" value={this.state.isbn} onChange={this.onInputChange} />
    </FormGroup>

    <FormGroup>
      <ControlLabel>TITLE</ControlLabel>
      <FormControl type="text" name="title" value={this.state.title} onChange={this.onInputChange} />
    </FormGroup>

    <FormGroup>
      <ControlLabel>AUTHOR</ControlLabel>
      <FormControl type="text" name="author" value={this.state.author} onChange={this.onInputChange} />
    </FormGroup>

    <FormGroup>
      <ControlLabel>QUANTITY AVAILABLE</ControlLabel>
      <FormControl type="text" name="available" value={this.state.available} onChange={this.onInputChange} />
    </FormGroup>
    <ButtonToolbar>
    <Button bsStyle="primary" onClick={this.goHome}>GO HOME</Button>
    <Button bsStyle="primary" onClick={this.submitBookCreation} disabled={isFormInvalid}>ADD</Button>
    </ButtonToolbar>
    {this.renderAlert()}
    </form>
    );
  }
}


export default withRouter(CreateBook);