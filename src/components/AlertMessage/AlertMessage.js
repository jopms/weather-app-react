import React from "react";

/**
 * AlertMessage component display an error message on top of the screen
 *
 * Props:
 *  - color (color of alert's background)
 *  - headerMessage (message of alert's header)
 *  - bodyMessage (message of alert's body)
 *  - showAlert (variable used to show or hide alert
 *  (show when : "" , hide when: hidden))
 *  - setShowAlert (callback function used to hide AlertMessage)
 *
 */

const AlertMessage = ({
  color,
  headerMessage,
  bodyMessage,
  showAlert,
  setShowAlert,
}) => {
  return (
    <div className={`ui ${color} floating message alert-message ${showAlert}`}>
      <i
        className="close icon"
        onClick={() => {
          setShowAlert("hidden");
        }}
      ></i>
      <div className="header">{headerMessage}</div>
      <p>{bodyMessage}</p>
    </div>
  );
};

export default AlertMessage;
