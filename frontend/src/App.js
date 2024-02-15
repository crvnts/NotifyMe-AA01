import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./index.css";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Navbar from "./components/navbar/Navbar";

const App = () => {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route exact path="/Dashboard" element={<Dashboard />} />
          <Route exact path="/Login" element={<Login />} />
        </Routes>
      </Fragment>
    </Router>
  );
};

export default App;
