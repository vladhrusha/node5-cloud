import fetch from "node-fetch";
export const handler = async (event) => {
  try {
    const response = await fetch(
      "https://europe-central2-micro-arcadia-388515.cloudfunctions.net/geolocation",
    );
    const data = await response.json();
    const cleanedString = data.cityLatLong.replace(':"', "").replace('"', "");
    const openWeatherMapKey = process.env.openWeatherToken;

    const [lat, long] = cleanedString.split(",");
    const fetchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${openWeatherMapKey}&units=metric&cnt=7`;
    const weatherResponse = await fetch(fetchURL);
    const result = await weatherResponse.json();
    return {
      statusCode: 200,
      body: result,
    };
  } catch (error) {
    // console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
