import React from 'react';

const LogOutput = (props) => {
  const {
    debug,
    failed,
    passed,
    skipped
  } = props.node;
  const {
    id,
    category,
    log
  } = props.log;

  if (category === 'PASSED' && passed === true) {
    return <p key={ id } className="text-success">{ log }</p>
  }

  if (category === 'SKIPPED' && skipped === true) {
    return <p key={ id } className="text-warning">{ log }</p>
  }

  if (category === 'FAILED' && failed === true) {
    return <p key={ id } className="text-danger">{ log }</p>
  }

  if (category === 'OTHER' && debug === true) {
    return <p key={ id } className="text-info">{ log }</p>
  }

  return null;
};

export default LogOutput;