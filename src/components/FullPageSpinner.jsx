import Spinner from "./Spinner";
import styles from "./FullPageSpinner.module.css";
function FullPageSpinner() {
  return (
    <div className={styles.spinner}>
      <Spinner />
    </div>
  );
}

export default FullPageSpinner;
