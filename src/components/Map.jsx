import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../context/CitiesContext";
import { useGeoLocation } from "../hooks/useGoeLocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

function Map() {
  const { cities } = useCities();
  const { lat, lng } = useUrlPosition();
  const [position, setPosition] = useState([40, 0]);
  const { isLoading, position: geoPosition, getPosition } = useGeoLocation();
  useEffect(() => {
    if (lat && lng) setPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoPosition?.lat && geoPosition?.lng) {
      setPosition([geoPosition.lat, geoPosition.lng]);
    }
  }, [geoPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoading ? "Loading ... " : "Use your Current Position"}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={position}
        zoom={7}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city, index) => {
          return (
            <Marker
              position={[city.position.lat, city.position.lng]}
              key={index}
            >
              <Popup>
                {city.cityName} <br /> Easily customizable.
              </Popup>
            </Marker>
          );
        })}
        <ChangePosition position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangePosition({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
