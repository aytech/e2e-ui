import Cookies from "universal-cookie/lib";
import { E2E_NODE } from "../constants/application";

export default class DockerService {
  apiBase = '/api';
  reportZip = '/download/report';
  pathGetBuildStatus = '/build/status';
  pathRunE2E = '/build/run';
  cookies = new Cookies();

  async getResource(url, headers) {
    const resource = await fetch(`${ this.apiBase }${ url }`, headers);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }

  getDockerBuildStatus = async () => {
    const nodeCookie = this.cookies.get(E2E_NODE);
    const node = nodeCookie === undefined ? '' : nodeCookie;
    const path = `${ this.pathGetBuildStatus }?node=${ node }`;
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
    const nodeCookie = this.cookies.get(E2E_NODE);
    const node = nodeCookie === undefined ? '' : nodeCookie;
    const path = `${ this.apiBase }${ this.reportZip }?node=${ node }`;
    return await fetch(path);
  };
}