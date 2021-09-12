import React, { useState, useEffect } from "react";
import axios from "axios";

import CurrentWeather from "./CurrentWeather/CurrentWeather";
import ForecastWeather from "./ForecastWeather/ForecastWeather";
import SavedLocations from "./SavedLocations/SavedLocations";
import AlertMessage from "./AlertMessage/AlertMessage";

/**
 * App component handles the opening and closing of each component aswell
 * as making the get requests to get weather's data through a search bar
 */

const App = () => {
  const API_KEY = "5e5765a835fd5c6a2e13ed922a1a6f46";

  const [coords, setCoords] = useState({}); // Used the first time user enter the website
  const [data, setData] = useState({}); // Current weather data
  const [savedLocations, setSavedLocations] = useState([]); // Saved locations ({city, country})
  const [forecastData, setForecastData] = useState({}); // Forecast weather data
  const [showMaxAlert, setShowMaxAlert] = useState("hidden"); // Used to show or hide max alert
  const [showSearchAlert, setShowSearchAlert] = useState("hidden"); // Used to show or hide search alert

  const time = new Date().getHours();

  useEffect(() => {
    /**
     * Changes background color depending on the user's time
     */
    if (time >= 20 || time <= 7) {
      document
        .getElementsByClassName("center-div")[0]
        .classList.remove("background-blue");
      document
        .getElementsByClassName("center-div")[0]
        .classList.add("background-dark-blue");
    }

    /**
     * Asks user for his geolocation if the browsers supports it
     * Triggers an alert when user's browser does not support geolocation
     * Gets his saved locations from local storage and saves them in savedLocations  variable
     */
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        successPosition,
        failurePosition
      );
    } else {
      alert(
        "Your browser does not support geolocation! Location set to Leiria"
      );
      setCoords({ latitude: 39.74362, longitude: -8.80705 });
    }

    if (localStorage.getItem("location")) {
      setSavedLocations(JSON.parse(localStorage.getItem("location")));
    }
  }, [time]);

  useEffect(() => {
    /**
     * Gets and saved data from current weather and forecast weather after
     * coords change
     */
    if (Object.keys(coords).length !== 0) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`
        )
        .then(({ data }) => {
          setData(data);
        });

      axios
        .get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.latitude}&lon=${coords.longitude}&exclude=minutely,hourly&appid=${API_KEY}`
        )
        .then(({ data }) => {
          setForecastData(data);
        });
    }
  }, [coords]);

  /**
   * Callback function to save coords
   */
  const successPosition = ({ coords }) => {
    setCoords({ latitude: coords.latitude, longitude: coords.longitude });
  };

  /**
   * Callback function to show alert when failing to get position
   * Sets coords to default value (location: Leiria) and alerts user
   */
  const failurePosition = ({ message }) => {
    alert(message + " Location set to Leiria!");
    setCoords({ latitude: 39.74362, longitude: -8.80705 });
  };

  /**
   * Handles key pressing when typing in searchbar. Triggers a new search when user clicks
   * the "Enter" key
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchByLocation(e.target.value.trim())) {
        e.target.value = "";
      }
    }
  };

  /**
   * Makes a new get request by location
   * Saves the location if 'save' variable is set to true
   * Hides the alert if showing
   */
  const searchByLocation = (location, save) => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
      )
      .then(({ data }) => {
        setData(data);
        document.getElementById("search-bar").value = "";
        save && saveLocation(data);
        !showSearchAlert && setShowSearchAlert("hidden");
        !showMaxAlert && setShowMaxAlert("hidden");

        axios
          .get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=minutely,hourly&appid=${API_KEY}`
          )
          .then(({ data }) => {
            setForecastData(data);
          });
      })
      .catch(() => {
        setShowSearchAlert("");
      });
  };

  /**
   * Triggers a new search if the searchbar is not empty
   * ALso saves the searched location if possible (when it is a new location and whithin the max limit)
   */
  const handleClickSave = () => {
    if (document.getElementById("search-bar").value !== "") {
      searchByLocation(document.getElementById("search-bar").value, true);
      return;
    }
    saveLocation(data);
  };

  /**
   * Saves a location both in local storage and savedLocation variable
   * if it does not exist yet in saved locations, and if whithin the max limit
   */
  const saveLocation = (data) => {
    if (savedLocations.length > 0) {
      if (savedLocations.length >= 6) {
        setShowMaxAlert("");
        return;
      }
      if (
        !savedLocations.some(
          (location) =>
            location.city === data.name && location.country === data.sys.country
        )
      ) {
        setSavedLocations([
          ...savedLocations,
          { city: data.name, country: data.sys.country },
        ]);
        localStorage.setItem(
          "location",
          JSON.stringify([
            ...savedLocations,
            { city: data.name, country: data.sys.country },
          ])
        );
      }
    } else {
      setSavedLocations([{ city: data.name, country: data.sys.country }]);
      localStorage.setItem(
        "location",
        JSON.stringify([{ city: data.name, country: data.sys.country }])
      );
    }
  };

  /**
   * Triggers a new search by location when clicking a saved location
   */
  const openLocation = (locationToOpen) => {
    searchByLocation(`${locationToOpen.city},${locationToOpen.country}`);
  };

  /**
   * Deletes a location when cliking the "x" icon in saved locations
   * Updates local storage and savedLocations variable
   */
  const deleteLocation = (locationToDelete) => {
    const updatedList = savedLocations.filter((location) => {
      return (
        location.city !== locationToDelete.city ||
        location.country !== locationToDelete.country
      );
    });
    setSavedLocations(updatedList);
    localStorage.setItem("location", JSON.stringify([...updatedList]));
  };

  return (
    <>
      <AlertMessage
        color="yellow"
        headerMessage="You cannot save more cities."
        bodyMessage="The maximum is 6"
        showAlert={showMaxAlert}
        setShowAlert={setShowMaxAlert}
      />
      <AlertMessage
        color="red"
        headerMessage="Error"
        bodyMessage="The current location you searched for is invalid."
        showAlert={showSearchAlert}
        setShowAlert={setShowSearchAlert}
      />
      {Object.keys(data).length > 0 ? (
        <div className="center-div background-blue">
          <div className="middle-div">
            <CurrentWeather data={data} />
            <div className="search-bar">
              <input
                id="search-bar"
                type="text"
                onKeyUp={(e) => {
                  handleKeyPress(e);
                }}
                autoComplete="off"
                placeholder={
                  Object.keys(data).length > 0
                    ? `${data?.name} , ${data?.sys?.country}`
                    : "Search new location..."
                }
              />
              <button
                onClick={() => {
                  handleClickSave();
                }}
                className="button-save"
              >
                {" "}
                Save Location
              </button>
            </div>
            <div className="saved-locations-wrap-wrap">
              <div className="saved-locations-centered">
                <div className="saved-locations-wrap">
                  {savedLocations.length > 0 ? (
                    <SavedLocations
                      data={savedLocations}
                      deleteLocation={deleteLocation}
                      openLocation={openLocation}
                    />
                  ) : (
                    null
                  )}
                </div>
              </div>
              <hr className="divider" />
            </div>
            <ForecastWeather data={forecastData} />
          </div>
        </div>
      ) : (
        <div className="center-div background-blue">
          <div className="ui active inverted loader large"></div>
        </div>
      )}
    </>
  );
};

export default App;
