import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

import Home from '../Home/Home';

import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

import InventoryList from './InventoryList';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';


const PrivateRoute = ({ component : Component, ...rest }) => (
  <Route {...rest} render ={() => (
    isAuthenticated() === true ? <Component {...props}/>
    : <Redirect to="/"/>
  )}></Route>
)


const isAuthenticated = () => {
  if(this.state.token) 
    return true;
  else
    return false;
}


class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: ''
    };

  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }


  render() {
    
    return (
      <Router>
        <div>
          <Route path='/' component={Home}></Route>
          <Route path="/inventory" component={InventoryList}></Route>    
        </div>
      </Router>
    );
  }

} 

export default App;
