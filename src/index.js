import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'
import BookList from './components/BookList'
import CreateBook from './components/CreateBook'
import LoginWithRouter from './components/LoginSection'

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

const App = () => (
   <Router>
    <div>
      <Route path="/login" component={LoginWithRouter}/>
      <Route exact path="/" component={LoginWithRouter}/>
      <Route path="/books" component={BookList}/>
      <Route path="/createBook" component={CreateBook}/>
    </div>
  </Router>
);

render(<App />, document.getElementById('root'));
