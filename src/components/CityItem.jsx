import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../context/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { id, cityName, date, position } = city;

  function handleClick(e) {
    e.preventDefault();
    deleteCity(id);
    console.log(id);
    // console.log("lkl");
  }

  return (
    <li>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem}  ${
          id === currentCity.id ? styles.cityItemactive : ""
        }`}
      >
        {/* <p className={styles.emoji}>{emoji}</p> */}
        <h3 className={styles.name}>{cityName}</h3>
        <p className={styles.date}>({formatDate(date)})</p>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
