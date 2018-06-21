import React , { Component }from 'react';

import { Link } from 'react-router-dom';

class Header extends Component {
  
  constructor(props){
    super(props);
  }

  render()
  {
    return(
      <header>
      <div className="container">
        <nav className="navbar navbar-light bg-light">
          <a className="navbar-brand" href="#">Inventory</a>
          <button type="button" className="btn btn-primary" onClick={this.props.onClick}>Logout</button>
        </nav>
      </div>  
    </header>
    );
  }

}
export default Header;
