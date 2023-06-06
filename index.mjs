import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.send("Hello, Lambda!");
});

export const handler = async (event, context) => {
  const server = app.listen(3000, () => {});

  const userip = event.requestContext.http.sourceIp;
  const url =
    "https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=at_hnqocVbdqNjbI76eTam4VPViLZtcm&ipAddress=";
  const response = await fetch(`${url}${userip}`);
  if (!response.ok) {
    throw new Error("Geolocation request failed");
  }
  const data = await response.json();
  const lat = data.location.lat;
  const lng = data.location.lng;
  const openWeatherMapKey = process.env.openWeatherToken;
  const fetchURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${openWeatherMapKey}&units=metric&cnt=7`;
  const weatherResponse = await fetch(fetchURL);
  const result = await weatherResponse.json();
  context.callbackWaitsForEmptyEventLoop = false;
  server.close();

  return {
    statusCode: 200,
    body: { result },
  };
};
