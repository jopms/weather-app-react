import React from "react";

/**
 * SavedLocations component displays the saved locations by the user
 *
 * Props:
 *  - data (data to be displayed)
 *  - deleteLocation (callback function used to delete the location)
 *  - openLocation (callback function used to "open" the location and display the 
 *  corresponding current and forecast weather )
 */

const SavedLocations = ({ data, deleteLocation, openLocation }) => {
  return data.map((location) => {
    return (
      <div key={location.city + location.country} className="saved-locations">
        <div className="text-close">
          <div className="saved-location-text" onClick={()=>{openLocation(location)}}>
            <span className="saved-location-city">{location.city}</span><span className="saved-location-country"> | {location.country}</span>
          </div>
          <span className="close-icon" onClick={()=>{deleteLocation(location)}}>
            <i className="times circle icon"></i>
          </span>
        </div>
      </div>
    );
  });
};

export default SavedLocations;
