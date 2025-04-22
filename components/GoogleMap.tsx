"use client";

import { useState, useEffect, useCallback } from "react";
import { GoogleMap as GoogleMapComponent, LoadScript, Marker } from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

interface GoogleMapProps {
  pickup?: string;
  dropoff?: string;
  pickupLatLng?: google.maps.LatLngLiteral;
  dropoffLatLng?: google.maps.LatLngLiteral;
  onPickupChange: (location: string, latLng: google.maps.LatLngLiteral) => void;
  onDropoffChange: (location: string, latLng: google.maps.LatLngLiteral) => void;
}

const libraries: Libraries = ["places", "geocoding"];
const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 0, lng: 0 }; // Fallback center

export default function GoogleMap({
  pickup,
  dropoff,
  pickupLatLng,
  dropoffLatLng,
  onPickupChange,
  onDropoffChange,
}: GoogleMapProps) {
  const [pickupInput, setPickupInput] = useState(pickup || "");
  const [dropoffInput, setDropoffInput] = useState(dropoff || "");
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(defaultCenter);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [settingPickup, setSettingPickup] = useState(false);

  // Initialize Places Autocomplete for Pickup
  const initPickupAutocomplete = useCallback(
    (input: HTMLInputElement) => {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = place.formatted_address || place.name || "";
          const latLng = {
            lat: place.geometry.location!.lat(),
            lng: place.geometry.location!.lng(),
          };
          setPickupInput(location);
          onPickupChange(location, latLng);
        }
      });
    },
    [onPickupChange]
  );

  // Initialize Places Autocomplete for Dropoff
  const initDropoffAutocomplete = useCallback(
    (input: HTMLInputElement) => {
      const autocomplete = new google.maps.places.Autocomplete(input);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = place.formatted_address || place.name || "";
          const latLng = {
            lat: place.geometry.location!.lat(),
            lng: place.geometry.location!.lng(),
          };
          setDropoffInput(location);
          onDropoffChange(location, latLng);
        }
      });
    },
    [onDropoffChange]
  );

  // Reverse Geocode clicked location
  const reverseGeocode = useCallback(
    (latLng: google.maps.LatLngLiteral, isPickup: boolean) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          if (isPickup) {
            setPickupInput(address);
            onPickupChange(address, latLng);
          } else {
            setDropoffInput(address);
            onDropoffChange(address, latLng);
          }
        } else {
          console.error("Geocoding failed:", status);
        }
      });
    },
    [onPickupChange, onDropoffChange]
  );

  // Handle map click to set pickup or dropoff
  const handleMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;
      const latLng = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      if (settingPickup) {
        reverseGeocode(latLng, true);
      } else {
        reverseGeocode(latLng, false);
      }
    },
    [settingPickup, reverseGeocode]
  );

  // Center map based on selected locations
  useEffect(() => {
    if (pickupLatLng && dropoffLatLng) {
      setMapCenter({
        lat: (pickupLatLng.lat + dropoffLatLng.lat) / 2,
        lng: (pickupLatLng.lng + dropoffLatLng.lng) / 2,
      });
    } else if (pickupLatLng) {
      setMapCenter(pickupLatLng);
    } else if (dropoffLatLng) {
      setMapCenter(dropoffLatLng);
    } else {
      // Default to user's location or a fallback
      navigator.geolocation.getCurrentPosition(
        (position) => setMapCenter({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setMapCenter(defaultCenter)
      );
    }
  }, [pickupLatLng, dropoffLatLng]);

  return (
    <LoadScript googleMapsApiKey={"AIzaSyA79Ieh37HYeFhZnFXp-Tg7Od4AS_X6Uyo"} libraries={libraries}>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={pickupInput}
            onChange={(e) => setPickupInput(e.target.value)}
            placeholder="Pickup Location"
            // ref={(ref) => ref && initPickupAutocomplete(ref)}
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setSettingPickup(true)}
            className={`p-2 rounded ${settingPickup ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Mark Pickup
          </button>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={dropoffInput}
            onChange={(e) => setDropoffInput(e.target.value)}
            placeholder="Dropoff Location"
            // ref={(ref) => ref && initDropoffAutocomplete(ref)}
            className="w-full p-2 border rounded"
          />
          <button
            type="button"
            onClick={() => setSettingPickup(false)}
            className={`p-2 rounded ${!settingPickup ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Mark Dropoff
          </button>
        </div>
        <GoogleMapComponent
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={10}
          onLoad={(map) => setMap(map)}
          onClick={handleMapClick}
        >
          {pickupLatLng && <Marker position={pickupLatLng} label="Pickup" />}
          {dropoffLatLng && <Marker position={dropoffLatLng} label="Dropoff" />}
        </GoogleMapComponent>
      </div>
    </LoadScript>
  );
}