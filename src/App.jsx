import React from 'react';
import {GoogleMap, useLoadScript, Marker, DirectionsRenderer} from "@react-google-maps/api"
import {geocodeByAddress, getLatLng} from 'react-google-places-autocomplete';
import mapStyles from "./mapStyles"
import gapi from 'gapi-client'

import './App.css';
import { func } from 'prop-types';

function App() {
  return(
    <GoogleCalendarAPI/>
  )
}

export function GoogleCalendarAPI(){
  const SCOPES = ['https://www.googleapis.com/auth/calendar'];

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {/* <button onClick={() => google.handleAuthClick()}>Sign In</button>
          <button onClick={() => google.handleSignoutClick()}>Sign Out</button> */}
        </div>
        {/* <button onClick={() => apiCalendar.setCalendar("Life & Health")}>Set Calentar</button> */}
      </header>
    </div>
  )
}

export function GoogleMapsAPI(){
  const [ libraries ] = React.useState(['places']);

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: "AIzaSyBZ-L6y4RM_Adga1qdKEj8ZTMCBkMHE_3o",
    libraries
  })

  const [center, setCenter] = React.useState({
    lat: 0,
    lng: 0
  })

  const [value, setValue] = React.useState(null);
  const [showMap, updateShowMap] = React.useState(false);

if (isLoaded) return (
    <div className="App">
      <header className="App-header">
        <h1>
          Google Maps API - Test
        </h1>
        <input type="text" className="place-searcher" placeholder="Address" onChange={(e) => {setValue(e.target.value); updateShowMap(false);}}/>
         <button onClick={() => {
           updateShowMap(true);
           geocodeByAddress(value)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) =>
              {setCenter({ lat, lng });}
            );
            }}>Find Place!</button>

            {showMap && <Map value={value} center={center}/>}
      </header>
    </div>
  );
}

export function Map({value, center}){
  const [directions, updateDirections] = React.useState(null)
  const [currentLocation, updateCurrentLocation] = React.useState(null)

  const mapContainerStyle = {
    width: '75vw',
    height: "60vh",
    borderRadius: '20px',
  }

  const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: false,
    gestureHandling: 'none'
  }

  const handlerOpen = () => {
    window.open(`https://www.google.com/maps?q=${value}`)
  }

  const GetDirections = () =>{
    const directionsService = new window.google.maps.DirectionsService();

    navigator?.geolocation.getCurrentPosition(({coords: {latitude: lat, longitude: lng}}) => {
      const pos = {lat, lng}
      updateCurrentLocation(pos)
    })

    directionsService.route(
      {
        origin: currentLocation,
        destination: center,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          updateDirections(result)
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  return(
    <div className="map">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={15.5}
        center={center}
        options={options}>
          <Marker position={{lat: center.lat, lng: center.lng}} />
          {currentLocation && <DirectionsRenderer
            directions={directions}
          />}
      </GoogleMap>
      <div className="map-buttons">
        <button onClick={() => GetDirections()}>Get Directions</button>
        <button onClick={() => handlerOpen}>Open In...</button>
      </div>
    </div>
  )
}

export default App;
