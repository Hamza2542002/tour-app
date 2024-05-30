// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer, useState } from "react";
import { useUrlPosition } from "../hooks/useUrlPosition";
import styles from "./Form.module.css";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Message from "./Message";
import Spinner from "./Spinner";
import "react-datepicker/dist/react-datepicker.css";
// import ReactDatePicker from "react-datepicker";
import DatePicker from "react-datepicker";
import { useCities } from "../context/CitiesContext";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const initialState = {
  cityName: "",
  country: "",
  emoji: "",
  error: "",
  isLoadingLoc: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoadingLoc: true,
        error: "",
      };
    case "city/loaded":
      return {
        ...state,
        cityName: action.payload.cityName,
        country: action.payload.countryName,
        emoji: action.payload.emoji,
        isLoadingLoc: false,
        error: "",
      };
    case "rejected":
      return {
        ...state,
        error: action.payload,
        isLoadingLoc: false,
      };

    default:
      break;
  }
}

function Form() {
  const navigate = useNavigate();
  const { postCity, isLoading } = useCities();
  const { lat: formLat, lng: formLng } = useUrlPosition();
  const [{ cityName, country, emoji, error, isLoadingLoc }, dispatch] =
    useReducer(reducer, initialState);
  const [date, setdate] = useState(new Date());
  const [notes, setNotes] = useState("");
  useEffect(
    function () {
      if (!formLat && !formLng) return;
      async function getCityData() {
        dispatch({ type: "loading" });
        try {
          const res = await fetch(
            `${BASE_URL}?latitude=${formLat}&longitude=${formLng}`
          );
          const data = await res.json();
          console.log(data);
          if (data.countryCode === "")
            throw new Error("There is No City Here ,Click Some where Else");
          dispatch({
            type: "city/loaded",
            payload: {
              cityName: data.city || data.locality,
              countryName: data.countryName,
              emoji: convertToEmoji(data.countryCode),
            },
          });
        } catch (err) {
          dispatch({ type: "rejected", payload: err.message });
        }
      }
      getCityData();
    },
    [formLng, formLat]
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat: formLat, lng: formLng },
    };
    console.log(newCity);
    await postCity(newCity);
    navigate("/app/cities");
  }

  if (isLoadingLoc) return <Spinner />;

  if (error.length > 0) return <Message message={error} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          // onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          selected={date}
          id="date"
          onChange={(date) => setdate(date)}
          dateFormat="dd/MM/YYYY"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button
          type="back"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
        >
          &larr; Back
        </Button>
      </div>
    </form>
  );
}

export default Form;
