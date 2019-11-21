import React from 'react'

const StandardOutput = (props) => {
  let input = null, error = null;
  const { stdInput, stdErr } = props;

  if (stdInput.length > 0) {
    input = stdInput.map(
      (line, index) => <p className="text-success" key={ index }>{ line }</p>
    )
  }

  if (stdErr.length > 0) {
    error = stdErr.map(
      (line, index) => <p className="text-danger" key={ index }>{ line }</p>
    )
  }

  return (
    <div className="output">
      { error }
      { input }
    </div>
  )
};

export default StandardOutput