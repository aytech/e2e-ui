import BaseService from "./BaseService";

export default class OutputService extends BaseService {
  deleteNode = async (nodeId) => {
    const request = {
      body: JSON.stringify({ id: nodeId }),
      headers: { 'Content-Type': 'application/json' },
      method: 'DELETE',
      mode: 'cors'
    };
    const url = `${ this.apiBase }${ this.nodeRemove }`;
    return this.getMapResource(url, request);
  };

  fetchNode = async (nodeId) => {
    return this.getMapResource(`${this.apiBase}${this.node}?node=${nodeId}`);
  };
}