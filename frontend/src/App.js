import './App.css';
import React, { Fragment } from 'react';
import { ReactDOM } from 'react';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';

//const rootElement = document.getElementById("root");
const App = () => {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route exact path="/Dashboard" element={<Dashboard/>}/>
          <Route exact path="/Login" element={<Login/>}/>
        </Routes>
      </Fragment>
    </Router>
  );
};
export default App;

/*
function App() {
  return (
    <div className="App">
      <Dashboard></Dashboard>
    </div>
  )
}
*/
