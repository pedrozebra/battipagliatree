import styles from "./App.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import newMarker from "./data/circle-16.png";
import { useState, useEffect } from "react";

import { townBoundaries } from "./data/data";
import { supabase } from "./lib/api";

export function ChangeView({ coords }) {
  const map = useMap();
  map.setView(coords, 16);
  return null;
}

const pointerIcon = new L.Icon({
  iconUrl: newMarker,
  iconSize: [16, 16], // size of the icon
  iconAnchor: [0, 0], // changed marker icon position
  popupAnchor: [0, 0], // changed popup position
});

const center = [40.608768, 14.98303];

function App() {
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    fetchTrees().catch(console.error);
  }, []);

  const fetchTrees = async () => {
    let { data: trees, error } = await supabase.from("trees").select("*");
    if (error) console.log("error", error);
    else setTrees(trees);
  };

  return (
    <>
      <div>Battipaglia Tree</div>
      <MapContainer center={center} style={{ height: "100vh" }}>
        {/* <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        /> */}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {trees &&
          trees.length > 0 &&
          trees.map((item) => (
            <Marker
              key={item.id}
              id={item.id}
              icon={pointerIcon}
              position={[item.position_x, item.position_y]}
            >
              <Popup className={styles.newPopup} minWidth={300}>
                <img
                  alt={item.name}
                  src={item.image}
                  width={100}
                  height={100}
                />
                <p><strong>Nome:</strong> {item.name}</p>
                <p><strong>Anno piantumazione:</strong> {item.year}</p>
              </Popup>
            </Marker>
          ))}

        <Polygon color="white" weight={1} positions={townBoundaries} />
        <ChangeView coords={center} />
      </MapContainer>
    </>
  );
}

export default App;
