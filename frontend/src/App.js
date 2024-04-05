import "./App.css";
import React, { Fragment } from "react";
import { ReactDOM } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import Dashboard from "./components/dashboardv2/Dashboard";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import TripPlanner from "./components/PlanTrip/TripPlanner";
import MyAccount from "./components/account/MyAccount";
import Feedback from "./components/Feedback/Feedback"

//const rootElement = document.getElementById("root");
const App = () => {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route exact path="/Dashboard" element={<Dashboard />} />
          <Route exact path="/" element={<Login />} />
          <Route exact path="/Register" element={<Register />} />
          <Route exact path="/Login" element={<Login />} />
          <Route exact path="/TripPlanner" element={<TripPlanner />} />
          <Route exact path="/MyAccount" element={<MyAccount/>} />
          <Route exact path="/Feedback" element={<Feedback/>} />
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
