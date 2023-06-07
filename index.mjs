import fetch from "node-fetch";

import dotenv from "dotenv";
dotenv.config();

export const handler = async (event, context) => {
  try {
    const sourceIp = event.requestContext.http.sourceIp;
    const url = process.env.geoIpfy_URL;
    const geoResponse = await fetch(`${url}${sourceIp}`);
    if (!geoResponse.ok) {
      throw new Error("Geolocation request failed");
    }
    const sourceGeoData = await geoResponse.json();
    const lat = sourceGeoData.location.lat;
    const lng = sourceGeoData.location.lng;

    const openWeatherMapKey = process.env.openWeatherToken;
    const fetchURL = `${process.env.openWeather_URL}?lat=${lat}&lon=${lng}&appid=${openWeatherMapKey}&units=metric&cnt=7`;
    const weatherResponse = await fetch(fetchURL);
    if (!weatherResponse.ok) {
      throw new Error("Forecast request failed");
    }
    const forecastResult = await weatherResponse.json();

    return {
      statusCode: 200,
      body: forecastResult,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
