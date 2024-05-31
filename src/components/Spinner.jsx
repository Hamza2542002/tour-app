import styles from "./Spinner.module.css";

function Spinner({ width, height }) {
  return (
    <div className={styles.spinnerContainer}>
      <div         
        style={{
          width: `${width ? width : ""}`,
          height: `${height ? height : ""}`,
        }} 
        className={styles.spinner}></div>
    </div>
  );
}

export default Spinner;
