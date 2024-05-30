import { useCities } from "../context/CitiesContext";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
function CountryList() {
  const { cities } = useCities();
  const countries = [...new Set(cities.map((el) => el.country))];
  return (
    <div className={styles.countryList}>
      {countries?.map((item, index) => {
        return <CountryItem country={item} key={index} />;
      })}
    </div>
  );
}

export default CountryList;
