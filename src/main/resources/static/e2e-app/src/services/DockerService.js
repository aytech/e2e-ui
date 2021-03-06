import Cookies from "universal-cookie/lib";
import { E2E_NODE } from "../constants/application";

export default class DockerService {
  apiBase = '/api';
  reportZip = '/build/report';
  pathGetBuildStatus = '/build/status';
  pathRunE2E = '/build/run';
  pathStopProcess = '/build/stop';
  cookies = new Cookies();

  async getResource(url, headers) {
    const resource = await fetch(`${ this.apiBase }${ url }`, headers);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }

  async getBlob(url, headers) {
    const resource = await fetch(`${ this.apiBase }${ url }`, headers);
    if (resource.status === 200) {
      return await resource.blob();
    }
    return null;
  }

  getE2eNodeCookie = () => {
    const nodeCookie = this.cookies.get(E2E_NODE);
    return nodeCookie === undefined ? '' : nodeCookie;
  };

  getDockerBuildStatus = async () => {
    return await this.getResource(`${ this.pathGetBuildStatus }?node=${ this.getE2eNodeCookie() }`)
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

  downloadReportZip = async (nodeID) => {
    const node = nodeID === undefined ? this.getE2eNodeCookie() : nodeID;
    return await this.getBlob(`${ this.reportZip }?node=${ node }`)
  };

  stopProcess = async () => {
    return await this.getResource(`${ this.pathStopProcess }?node=${ this.getE2eNodeCookie() }`)
  };
}