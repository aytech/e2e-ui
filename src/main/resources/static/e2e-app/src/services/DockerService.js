export default class DockerService {
  apiBase = '/api';
  reportZip = '/download/report';
  pathGetBuildStatus = '/build/status';
  pathRunE2E = '/build/run';

  async getResource(url, headers) {
    const resource = await fetch(`${ this.apiBase }${ url }`, headers);
    const response = await resource.json();
    response.status = resource.status;
    return response;
  }

  async getBlob(url, headers) {
    const resource = await fetch(`${ this.apiBase }${ url }`, headers);
    return await resource.blob();
  }

  getDockerBuildStatus = async () => {
    return await this.getResource(this.pathGetBuildStatus)
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
  }
}