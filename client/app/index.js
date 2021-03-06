import React from 'react';
import { render } from 'react-dom';



import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

import App from './components/App/App';
import NotFound from './components/App/NotFound';

import Home from './components/Home/Home';
import InventoryList from './components/App/InventoryList';

import HelloWorld from './components/HelloWorld/HelloWorld';

import './styles/styles.scss';




render((
  <App/>
), document.getElementById('app'));
