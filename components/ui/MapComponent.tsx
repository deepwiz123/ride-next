"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { Coordinates } from "@/types/booking";

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface MapComponentProps {
  pickupLatLng?: Coordinates;
  dropoffLatLng?: Coordinates;
  setPickupLatLng: (coords: Coordinates) => void;
  setDropoffLatLng: (coords: Coordinates) => void;
  setPickupAddress: (address: string) => void;
  setDropoffAddress: (address: string) => void;
}

const MapUpdater: React.FC<MapComponentProps> = ({
  pickupLatLng,
  dropoffLatLng,
  setPickupLatLng,
  setDropoffLatLng,
  setPickupAddress,
  setDropoffAddress,
}) => {
  const map = useMap();
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const dropoffMarkerRef = useRef<L.Marker | null>(null);

  // Center map on pickup or default location
  useEffect(() => {
    if (pickupLatLng) {
      map.setView([pickupLatLng.lat, pickupLatLng.lng], 13);
    } else {
      map.setView([37.7749, -122.4194], 10); // Default: San Francisco
    }
  }, [pickupLatLng, map]);

  // Reverse geocode when marker is dragged
  const reverseGeocode = async (latlng: L.LatLng, type: "pickup" | "dropoff") => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`,
        { headers: { "User-Agent": "RideReservationApp" } }
      );
      const address = response.data.display_name;
      if (type === "pickup") {
        setPickupAddress(address);
        setPickupLatLng({ lat: latlng.lat, lng: latlng.lng });
      } else {
        setDropoffAddress(address);
        setDropoffLatLng({ lat: latlng.lat, lng: latlng.lng });
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
    }
  };

  return (
    <>
      {pickupLatLng && (
        <Marker
          position={[pickupLatLng.lat, pickupLatLng.lng]}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              reverseGeocode(position, "pickup");
            },
          }}
          ref={pickupMarkerRef}
        />
      )}
      {dropoffLatLng && (
        <Marker
          position={[dropoffLatLng.lat, dropoffLatLng.lng]}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              reverseGeocode(position, "dropoff");
            },
          }}
          ref={dropoffMarkerRef}
        />
      )}
    </>
  );
};

export default function MapComponent({
  pickupLatLng,
  dropoffLatLng,
  setPickupLatLng,
  setDropoffLatLng,
  setPickupAddress,
  setDropoffAddress,
}: MapComponentProps) {
  return (
    <MapContainer
      center={[37.7749, -122.4194]}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
      className="leaflet-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapUpdater
        pickupLatLng={pickupLatLng}
        dropoffLatLng={dropoffLatLng}
        setPickupLatLng={setPickupLatLng}
        setDropoffLatLng={setDropoffLatLng}
        setPickupAddress={setPickupAddress}
        setDropoffAddress={setDropoffAddress}
      />
    </MapContainer>
  );
}