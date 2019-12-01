import Cookies from "universal-cookie/lib";
import { E2E_NODE } from "../constants/application";

export default class DockerService {
  apiBase = '/api';
  reportZip = '/download/report';
  pathCleanConfig = '/config/clean';
  pathGetBuildStatus = '/build/status';
  pathRunE2E = '/build/run';

  async getResource(url, headers) {
    const resource = await fetch(`${ this.apiBase }${ url }`, headers);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }

  getDockerBuildStatus = async () => {
    const cookies = new Cookies();
    const nodeCookie = cookies.get(E2E_NODE);
    let path = this.pathGetBuildStatus;
    if (nodeCookie !== undefined) {
      path = `${ this.pathGetBuildStatus }?node=${ nodeCookie }`;
    }
    return await this.getResource(path)
  };

  runE2ESuite = async (request) => {
    const data = {
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    return await this.getResource(this.pathRunE2E, data)
  };

  downloadReportZip = async () => {
    return await fetch(`${ this.apiBase }${ this.reportZip }`);
  };

  cleanConfiguration = async () => {
    return await this.getResource(this.pathCleanConfig);
  };
}