import React, { useState, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import "./App.css";
import moment from "moment";

function App() {
  const [viewport, setViewport] = useState({
    latitude: 39.7392,
    longitude: -104.9903,
    zoom: 2,
    width: '100vw',
    height: '100vh'
  });

  const [earthquakes, setEarthquakes] = useState([]);

  const [selectedQuake, setSelectedQuake] = useState(null);  

  useEffect(() => {
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson')
    .then(res => res.json())
    .then(data => setEarthquakes(data.features.map(f => {
    return {
      id: f.id,
      place: f.properties.place,
      type: f.properties.type,
      time: f.properties.time,
      magnitude: f.properties.mag,
      lat: f.geometry.coordinates[1],
      long: f.geometry.coordinates[0],
      depth: f.geometry.coordinates[2],
      url: f.properties.url
    }})
    )
    )
  }, [])

  useEffect(() => {
    const listener = e => {
      if(e.key === "Escape"){
        setSelectedQuake(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    }
  }, []);

  return (
    <div>
      <ReactMapGL
        {...viewport}
        onViewportChange={(viewport) => setViewport({...viewport})}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/sgillet/ck36sv6240as41dnxle37bzbb"
        >
        {earthquakes.map((earthquake) => (
          <Marker key={earthquake.id} latitude={earthquake.lat} longitude={earthquake.long}>
            <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedQuake(earthquake);
              }}
            >
              <img src="quake.png" alt="earthquake" />
            </button>
          </Marker>
        ))}
        {
          selectedQuake && (
            <Popup 
              latitude={selectedQuake.lat}
              longitude={selectedQuake.long}
              onClose={() => setSelectedQuake(null)}
              >
              <h3>
                {selectedQuake.place}
                <br/>
                {`Magnitude ${selectedQuake.magnitude}`}
              </h3>
              <div>
                {`${moment(selectedQuake.time).format("MMMM Do YYYY, h:mm:ss a")}`}
                <br/>
                {`Earthquake depth: ${selectedQuake.depth} km`}
              </div>
            </Popup>
          )
        }
      </ReactMapGL>
    </div>
  );
}

export default App;
