import React, { useEffect } from "react";

/**
 * ForecastWeatherCard displays the Forecast Weather
 *
 * Props:
 *  - data (data to be displayed)
 *  - offSet (value of class index of each card, needed to fade in and fade out)
 *  - setOpenDetailCard (callback function to open ForecastWeatherCardOpened component)
 *  setOpenDetailCard(dataToOpen)
 */

const ForecastWeatherCard = ({ data, offSet, setOpenDetailCard }) => {
  const day = new Date(data.dt * 1000);

  useEffect(() => {
    document
      .getElementsByClassName("forecast-card")
      [offSet - 1].classList.remove("fade-out");

    document
      .getElementsByClassName("forecast-card")
      [offSet - 1].classList.add("fade-in");
  }, [offSet]);

  const handleClick = () => {
    setOpenDetailCard(data);
  };
  return (
    <div className="forecast-card fade-out" onClick={() => handleClick()}>
      <div className="forecast-day-wrapper">
        <span className="forecast-day">
          {day.toString().split(" ")[0] + "."}
        </span>
      </div>
      <div className="forecast-icon-text">
        <div className="forecast-icon">
          <div className={`icon${data.weather[0].icon} forecast-icon`}></div>
        </div>
        <div className="forecast-text">{data.weather[0].main}</div>
      </div>
      <div className="forecast-max-min">
        <div className="forecast-temp">
          <span className="forecast-temp-max">Máx.</span>
          <span>{Math.round(data.temp?.max - 273.15)}º</span>
        </div>
        <div className="forecast-temp">
          <span>Min.</span>
          <span>{Math.round(data.temp?.min - 273.15)}º</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastWeatherCard;
