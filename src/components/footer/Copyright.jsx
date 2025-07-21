import React from "react";

function Copyright() {
  return (
    <React.Fragment>
      <div className="copyright my-0" style={{background: "#000000"}}>
        <div className="container">
          <p className="text-center text-white font-14 mb-0 font-regular">
            © 2020 Travel Portal. All rights reserved | Made with{" "}
            <span role="img" aria-label="heart">
              💖
            </span>{" "}
            at
            <a href="http://www.hackncs.com/" className="text-white">
              {" "}
              Nibble Labs
            </a>
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Copyright;
