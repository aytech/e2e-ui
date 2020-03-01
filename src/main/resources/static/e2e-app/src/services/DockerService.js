export default class DockerService {
  apiBase = '/api';
  reportZip = '/build/report';
  pathGetBuildStatus = '/build/status';
  pathRunE2E = '/build/run';
  pathStopProcess = '/build/stop';

  async getResource(url, headers) {
    const resource = await fetch(`${ this.apiBase }${ url }`, headers);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }

  async getBlob(url, headers) {
    return  await fetch(`${ this.apiBase }${ url }`, headers);
    // if (resource.status === 200) {
    //   return await resource.blob();
    // }
    // return null;
  }

  getDockerBuildStatus = async (nodeId) => {
    return await this.getResource(`${ this.pathGetBuildStatus }?node=${ nodeId }`)
  };

  runE2ESuite = async () => {
    const data = {
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      mode: 'cors'
    };
    return await this.getResource(this.pathRunE2E, data)
  };

  downloadReportZip = async (nodeId) => {
    return await this.getBlob(`${ this.reportZip }?node=${ nodeId }`)
  };

  stopProcess = async (nodeId) => {
    return await this.getResource(`${ this.pathStopProcess }?node=${ nodeId }`)
  };
}