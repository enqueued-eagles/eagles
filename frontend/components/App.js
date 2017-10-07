import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar';
import { Image } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {!this.props.isLogged ? null : (
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Image src="http://www.learnpdf.com/wp-content/uploads/2014/01/Icon-Learn-PDF-3-Ways-Training-300px.png" width="50" height="50"/>
            <a style={{color: 'white', fontSize: 17, alignItems: 'center'}}>TEACH YO SELF</a>
            <br></br>
          </div>
        )}
        <NavBar
          history= { this.props.history }
          queryDataBaseWithSearchInput={this.props.queryDataBaseWithSearchInput}
          logout={ this.props.logout }
          getLessons={ this.props.getLessons }
          user = {this.props.user}
        />
        { this.props.children || 'no children!' }
      </div>
    );
  }
}



export default withRouter(App);
