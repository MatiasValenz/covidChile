import React, { Fragment } from "react";
import "./styles/loading.css";
const Loading = () => {
  return (
    <Fragment>
      <div className="content">
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </Fragment>
  );
};

export default Loading;
