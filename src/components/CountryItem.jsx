import styles from "./CountryItem.module.css";
import ReactCountryFlag from "react-country-flag"

function CountryItem({ country , emoji }) {
  return (
    <li className={styles.countryItem}>
      {/* <span>{country.emoji}</span> */}
      <span>
      <ReactCountryFlag
        countryCode={emoji}
        styles = {styles.emoji}
        svg
        cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
        cdnSuffix="svg"
        title={emoji}
        />
        </span>
      <span>{country}</span>
    </li>
  );
}

export default CountryItem;
