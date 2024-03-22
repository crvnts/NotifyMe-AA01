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
import Login from "./components/Login/Login";
import Register from "./components/register/Register";
import TripPlanner from "./components/PlanTrip/TripPlanner";
import DirectionsApp from "./components/directions/DirectionsApp";

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
          <Route path="/directions" element={<DirectionsApp />} />
          <Route exact path="/TripPlanner" element={<TripPlanner />} />
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
