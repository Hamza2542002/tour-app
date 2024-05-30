import Sidebar from "./Sidebar";
import Map from "./Map";
import styles from "./AppLayout.module.css";
import User from "./User";
import { useAuth } from "../context/FakeAuthContext";
import ProtectedRotes from "../pages/ProtectedRotes";
function AppLoayout() {
  const { isAuth } = useAuth();
  return (
    <ProtectedRotes>
      <div className={styles.app}>
        <Sidebar />
        <Map />
        {isAuth && <User />}
      </div>
    </ProtectedRotes>
  );
}

export default AppLoayout;
