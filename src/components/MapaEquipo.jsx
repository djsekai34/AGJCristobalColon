import { useEffect, useRef, useState } from "react";
import anclaImg from "../Imagenes/Ancla.png";
import brujulaImg from "../Imagenes/Brujula.png";
import barcoImg from "../Imagenes/Barco.png";
import mapaImg from "../Imagenes/Mapa.png";

const teamMembers = [
  {
    id: 1,
    name: "David Jimenez Villena",
    role: "Game Developer & Web Designer",
    city: "Alcalá La Real, (Jaén) España",
    img: anclaImg,
    lat: 37.4614,
    lng: -3.9217,
  },
  {
    id: 2,
    name: "Francisco Torres Puche",
    role: "Game Developer",
    city: "Torredonjimeno, (Jaén) España",
    img: brujulaImg,
    lat: 37.7663,
    lng: -3.9575,
  },
  {
    id: 3,
    name: "Eva Gongora Fuentes",
    role: "Artist",
    city: "Úbeda, (Jaén) España",
    img: barcoImg,
    lat: 38.0075,
    lng: -3.3712,
  },
  {
    id: 4,
    name: "Jose Andres Garrido Gutierrez",
    role: "Game Developer",
    city: "Baeza, (Jaén) España",
    img: mapaImg,
    lat: 37.9934,
    lng: -3.4697,
  },
];

export default function TeamMap({ activeId, onMarkerClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // Dynamic import of leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (mapRef.current && !mapInstanceRef.current) {
        const map = L.map(mapRef.current, {
          center: [40.0, -3.5],
          zoom: 6,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        // OpenStreetMap tiles with sepia CSS filter
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18,
        }).addTo(map);

        // Add custom markers
        teamMembers.forEach((member) => {
          const icon = L.divIcon({
            html: `<div class="custom-marker" title="${member.name}"><img src="${member.img}" alt="${member.name}" style="width:36px;height:36px;object-fit:contain;" /></div>`,
            className: "",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          });

          const marker = L.marker([member.lat, member.lng], { icon })
            .addTo(map)
            .bindPopup(
              `
              <div style="font-family: 'Cinzel', serif; min-width: 150px;">
                <div style="text-align: center; margin-bottom: 4px;"><img src="${member.img}" alt="${member.name}" style="width:40px;height:40px;object-fit:contain;" /></div>
                <strong style="display:block; font-size: 0.9rem; color: #4a2c0a;">${member.name}</strong>
                <em style="font-size: 0.8rem; color: #8b6914;">${member.role}</em><br/>
                <small style="color: #666;">📍 ${member.city}</small>
              </div>
            `,
              {
                className: "custom-popup",
              },
            )
            .on("click", () => onMarkerClick && onMarkerClick(member.id));

          markersRef.current[member.id] = marker;
        });

        mapInstanceRef.current = map;
        setMapReady(true);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle activeId changes - fly to location + bounce effect
  useEffect(() => {
    if (!mapReady || !activeId) return;
    const member = teamMembers.find((m) => m.id === activeId);
    const marker = markersRef.current[activeId];
    if (member && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([member.lat, member.lng], 12, {
        animate: true,
        duration: 1.2,
      });
    }
    if (marker) {
      // Delay popup until flyTo finishes
      setTimeout(() => {
        marker.openPopup();
      }, 1300);
      // Trigger bounce on the icon element
      const iconEl = marker.getElement();
      if (iconEl) {
        const inner = iconEl.querySelector(".custom-marker");
        if (inner) {
          inner.classList.remove("bounce");
          void inner.offsetWidth; // reflow
          inner.classList.add("bounce");
        }
      }
    }
  }, [activeId, mapReady]);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 map-border rounded"
      style={{
        filter: "sepia(50%) saturate(80%) contrast(95%)",
        zIndex: 0,
      }}
      aria-label="Mapa interactivo del equipo"
    />
  );
}

export { teamMembers };
