import React from 'react'

const StandardOutput = (props) => {
  return (
    <div className="output">
      {
        props.output.map(
          (line, index) => <p className="text-success" key={ index }>{ line }</p>
        )
      }
    </div>
  )
};

export default StandardOutput