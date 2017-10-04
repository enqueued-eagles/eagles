import React, { Component } from 'react';
import App from './App';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LessonPreviewContainer from './Lesson/LessonPreviewContainer.js';
import Lesson from './Lesson/Lesson.js';
import LessonCreator from './Creator/LessonCreator';
import User from './User';
import Login from './Auth/Login';


class RouterWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lessons: [],
      loggedIn: false,
      displayLogginError: false,
      user: {}
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getLessons = this.getLessons.bind(this);
    this.createAccount = this.createAccount.bind(this);
    this.queryDataBaseWithSearchInput = this.queryDataBaseWithSearchInput.bind(this);
    this.organizeSearchResultsBasedOnMostLikes = this.organizeSearchResultsBasedOnMostLikes.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  componentDidMount() {
  }

  getUsers() {
    return fetch('/users/', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((users) => {
      return users
    })
    .catch((err) => console.log('Error getting lessons', err));
  }

  getLessons() {
    return fetch('/lessons', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((lessons) => {
      console.log(lessons)
      this.setState({lessons});
      return lessons
    })
    .catch((err) => console.log('Error getting lessons', err));
  }

  queryDataBaseWithSearchInput(searchInput) {
    this.getLessons()
    .then((results) => {
      var filteredLessons = this.state.lessons.filter((lesson) => {
        var lowerSearchInput = searchInput.toLowerCase();
        if (lesson.keywords.includes(lowerSearchInput) || lowerSearchInput === '') {
          return lesson;
        }
      });
      this.setState({
        lessons: filteredLessons,
      });
      console.log(this.state.lessons)
    })
  }

  organizeSearchResultsBasedOnMostLikes() {
    var lessons = this.state.lessons;
    lessons.sort(function(lesson1, lesson2) {
      return lesson2.likes - lesson1.likes;
    })
    this.setState({
      lessons: lessons
    });
  }

  createAccount(username, password, email) {
    let num = Math.floor((Math.random() * 150) + 1)

    let data = {
      username,
      password,
      email,
      avatarURL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${num}.png`
    };
    fetch('/user', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('got data', data);
      if(data.loggedIn === true) {
        this.setState({
          user: data.userData,
          loggedIn: true,
          displayLogginError: false
         });
      } else {
        this.setState({ displayLogginError: true });
      }
    })
    .catch((err) => console.log('Error creating an account!', err));
  }

  login(username, password, email) {
    let data = {
      username: username,
      password: password,
      email: email
    };
    fetch('/login', {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('login got data', data);
      if(data.loggedIn === true) {
        this.getLessons();
        this.setState({
          user: data.userData,
          loggedIn: true,
          displayLogginError: false
         });
      } else {
        this.setState({ displayLogginError: true });
      }
    })
    .catch((err) => console.log('Error Logging In!', err));
  }

  logout() {
    console.log('logging out');
    fetch('/logout', {
      method: "GET",
      credentials: "include"
    });
    this.setState({
      loggedIn: false,
      displayLogginError: false,
      user: {}
     });
  }

  render() {
    return (
      <BrowserRouter>
        <App
        queryDataBaseWithSearchInput={ this.queryDataBaseWithSearchInput }
        logout={ this.logout }
        getLessons={ this.getLessons }
        user = {this.state.user.username}
        >
          { this.state.loggedIn ? // If you are logged in allow all routes
         (<Switch>
            <Route exact path='/'
              render={() => (
                <LessonPreviewContainer
                  lessons= { this.state.lessons }
                  organizeSearchResultsBasedOnMostLikes={ this.organizeSearchResultsBasedOnMostLikes }
                  getLessons={ this.getLessons }
                  getUsers={this.getUsers}
                />
              )}
            />
            <Route path='/lesson/:id'
              getLessons={ this.getLessons }
              component={ Lesson }
            />
            <Route path='/create'
              render={ () => (
                <LessonCreator
                  username={this.state.user.username}
                  userRef={this.state.user._id}
                  getLessons={this.getLessons}
                />
              )}
            />

            <Route path='/user/:id' render={ () => 
                <User 
                  user={ this.state.user }
                  getLessons={ this.getLessons }
                />
              }
            />
            <Route path='/logout' render={ () => (
              <Logout logout={ this.logout }/>
            )}
            />
          </Switch>) : // if not, everything goes to the login component
          (<Switch>
              <Route path='*' render={ () =>
                <Login
                  login={ this.login }
                  displayLogginError={ this.state.displayLogginError }
                  createAccount={ this.createAccount }
                />
              }/>
            </Switch>)
            }
        </App>
      </BrowserRouter>
    );
  }
}

export default RouterWrapper;