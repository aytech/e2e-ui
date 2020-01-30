import React from 'react';
import PageHeader from "../page-header/page-header";
import './app.css';
import Form from "../form/form";
import Output from "../output/output";
import Container from "react-bootstrap/Container";

const App = () => {
  return (
    <React.Fragment>
      <PageHeader/>
      <Container>
        <Form/>
        <Output/>
      </Container>
    </React.Fragment>
  );
};

export default App;