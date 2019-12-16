import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DockerService from "../../services/DockerService";
import { withRouter } from "react-router";

class DownloadReport extends Component {

  dockerService = new DockerService();

  downloadReportZip = () => {
    let { nodeID } = this.props.match.params;
    this.dockerService
      .downloadReportZip(nodeID)
      .then(blob => {
        if (blob !== null) {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'e2e_report.zip';
          a.click();
        }
      });
  };

  render() {
    this.downloadReportZip();
    return <Redirect to="/"/>
  }
}

export default withRouter(DownloadReport)