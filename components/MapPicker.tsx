"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix for default Leaflet icons in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

interface MapPickerProps {
    value: string
    onChange: (value: string) => void
}

function LocationMarker({ position, setPosition, onChange }: { 
    position: L.LatLng | null, 
    setPosition: (pos: L.LatLng) => void,
    onChange: (val: string) => void
}) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
            
            // Reverse geocoding
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.village || "";
                        const country = data.address.country || "";
                        const locationString = city ? `${city}, ${country}` : country;
                        onChange(locationString)
                    }
                })
                .catch(err => console.error("Reverse geocoding error:", err));
        },
    })

    return position === null ? null : (
        <Marker position={position} icon={icon}></Marker>
    )
}

export default function MapPicker({ value, onChange }: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return <div className="h-[300px] w-full bg-black/[0.04] rounded-2xl animate-pulse" />

    return (
        <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-black/[0.04]">
            <MapContainer 
                center={[52.06, 19.25]} // Center of Poland
                zoom={5} 
                scrollWheelZoom={true} 
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <LocationMarker position={position} setPosition={setPosition} onChange={onChange} />
            </MapContainer>
        </div>
    )
}
