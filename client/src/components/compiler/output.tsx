import React from "react";

const Output = ({ codeSubmitted }: { codeSubmitted: boolean }) => {
  if (!codeSubmitted) {
    return (
      <div className="p-3">
        <h1>Output</h1>
        <p>Output will be displayed here</p>
      </div>
    );
  }
  return (
    <div className="p-3">
      <h1>Output</h1>
      <p>Output will be displayed here</p>
    </div>
  );
};

export default Output;
