const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";
// const API_KEY = "";
import axios from "axios";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": [
      "places.display_name",
      "places.formattedAddress",
      "places.formattedAddress",
      "places.location",
      "places.evChargeOptions",
      "places.photos",
      "places.id",
    ],
  },
};

const NewNearByPlace = (data) => axios.post(BASE_URL, data, config); //async function

export default {
  NewNearByPlace,
};
