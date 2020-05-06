import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Fib from "./Fib";
import Page1 from "./Page1";

function App() {
  return (
    <Router>
      <div>
        <Link to="/">Fib</Link>
        <Link to="/page1">Page 1</Link>
      </div>
      <div>
        <Route path="/" exact component={Fib} />
        <Route path="/page1" component={Page1} />
      </div>
    </Router>
  );
}

export default App;
