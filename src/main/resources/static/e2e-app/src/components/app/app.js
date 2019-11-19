import React from 'react';
import PageHeader from "../page-header/page-header";
import './app.css';
import Form from "../form/form";
import Output from "../output/output";

const App = () => {
  return (
    <React.Fragment>
      <PageHeader/>
      <div className="container">
        <Form/>
        <Output/>
      </div>
    </React.Fragment>
  );
};

export default App;