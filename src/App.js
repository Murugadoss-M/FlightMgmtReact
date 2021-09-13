import './App.css';
import Header from './Components/Header';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import LoginPage from './Components/LoginPage';
import Search from './Components/Search';
import Admin from './Components/Admin';
import Book from './Components/Book';
import Logout from './Components/Logout';
import { Provider } from 'react-redux';
import store from './Components/redux/store'
import Checkout from './Components/Checkout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/admin" component={Admin} />
            <Route path="/book/:id" component={Book} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/logout" component={Logout} />
            <Route path="/" exact component={Search} />

          </Switch>
        </div>
      </Router>
    </Provider>
  );
}
export default App;
