import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import { useCities } from "../context/CitiesContext";
function CityList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (cities.lenght === 0) return <Message message={"Add some Cities"} />;
  return (
    <div className={styles.cityList}>
      {cities?.map((item, index) => {
        return <CityItem city={item} key={index} />;
      })}
    </div>
  );
}

export default CityList;
