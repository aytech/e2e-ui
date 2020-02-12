import React from 'react';
import PageHeader from "../page-header/page-header";
import './app.css';
import Runner from "../runner/runner";
import Output from "../output/output";
import Container from "react-bootstrap/Container";

const App = () => {
  return (
    <React.Fragment>
      <PageHeader/>
      <Container>
        <Runner/>
        <Output/>
      </Container>
    </React.Fragment>
  );
};

export default App;