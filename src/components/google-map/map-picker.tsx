import {
  Autocomplete,
  GoogleMap,
  //Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { LocateIcon, Maximize2, Minimize2 } from "lucide-react";
import React, { /*useCallback,*/ useEffect, useRef, useState } from "react";

// type MapPickerProps = {
//     onAddressChange: (address: string) => void;
// };

type MapPickerProps = {
  onLocationChange: (data: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  initialAddress?: string;
  initialLat?: number;
  initialLng?: number;
};

// const libraries: (
//   | "places"
//   | "drawing"
//   | "geometry"
//   | "localContext"
//   | "visualization"
// )[] = ["places"];

type Library = "places" | "drawing" | "geometry" | "visualization";
const libraries: Library[] = ["places"];

const containerStyle = {
  width: "100%",
  height: "320px",
};

const defaultCenter = {
  lat: 23.873751,
  lng: 90.396454,
};

const MapPickerWithSearch: React.FC<MapPickerProps> = ({
  onLocationChange,
  initialAddress,
  initialLat,
  initialLng,
}) => {
  const hasInitialData = initialAddress && initialLat && initialLng;
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null); // for debouncing idle event which can fire multiple times while dragging map
  const [markerPosition, setMarkerPosition] = useState(
    hasInitialData ? { lat: initialLat, lng: initialLng } : defaultCenter,
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null); // For fullscreen targeting

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  // Handle browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Initialize input field with initial address if provided
  useEffect(() => {
    if (initialAddress && inputRef.current) {
      inputRef.current.value = initialAddress;
    }
  }, [initialAddress]);

  // On map load, try to get user's current location and center map there (if no initial data)
  useEffect(() => {
    if (!isLoaded) return;
    if (hasInitialData) return; // Skip if initial data is provided

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setMarkerPosition(pos); // center state
        map?.panTo(pos); // move map

        getAddressFromLatLng(pos); // get address
      },
      (error) => {
        console.warn("Location access denied or failed:", error.message);
      },
    );
  }, [isLoaded, map, hasInitialData]);

  /** Reverse geocode and update parent + input */
  const getAddressFromLatLng = (latLng: google.maps.LatLngLiteral) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const address = results[0].formatted_address;
        // onAddressChange(address);
        onLocationChange({
          address,
          lat: latLng.lat,
          lng: latLng.lng,
        });
        if (inputRef.current) inputRef.current.value = address;
      }
    });
  };

  // commented since we are using idle event to get center position, so clicking on map won't be needed to get address.
  // But can be enabled if you want to allow users to click anywhere on map to select location instead of dragging map center.
  // const onMapClick = useCallback(
  //     (e: google.maps.MapMouseEvent) => {
  //         if (!e.latLng) return;
  //         const latLng = e.latLng;
  //         const lat = latLng.lat();
  //         const lng = latLng.lng();
  //         setMarkerPosition({ lat, lng });

  //         const geocoder = new google.maps.Geocoder();
  //         geocoder.geocode({ location: latLng }, (results, status) => {
  //             if (status === "OK" && results?.[0]) {
  //                 // onAddressChange(results[0].formatted_address);
  //                 const address = results[0].formatted_address;
  //                 onLocationChange({ address, lat, lng });
  //                 if (inputRef.current) {
  //                     inputRef.current.value = results[0].formatted_address;
  //                 }
  //             }
  //         });
  //     },
  //     [/*onAddressChange*/ onLocationChange]
  // );

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setMarkerPosition({ lat, lng });

    if (map) {
      map.panTo({ lat, lng });
    }

    // const formatted = place.formatted_address || place.name || "";
    // onAddressChange(formatted);
    const address = place.formatted_address || place.name || "";
    onLocationChange({ address, lat, lng });

    if (inputRef.current) {
      inputRef.current.value = address;
    }
  };

  /** Button click: go to current location */
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMarkerPosition(pos);
        map?.panTo(pos);
        getAddressFromLatLng(pos);
        setIsLocating(false);
      },
      (error) => {
        alert(
          `Location permission not given or Error getting location: ${error.message}`,
        );
        setIsLocating(false);
      },
    );
  };

  /** Toggle browser fullscreen for map container */
  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;

    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded || !markerPosition) return <div>Loading map...</div>;

  return (
    <div className="space-y-2 mt-6">
      {/* Search input */}
      <Autocomplete
        onLoad={(auto) => (autocompleteRef.current = auto)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search address"
          className="w-full h-10 px-3 border border-gray-300 rounded-md"
        />
      </Autocomplete>

      <div
        ref={mapContainerRef}
        className="relative"
        style={{
          height: isFullscreen ? "100vh" : containerStyle.height,
          width: "100%",
          transition: "height 0.3s ease",
        }}
      >
        {/* Map */}
        <GoogleMap
          // mapContainerStyle={containerStyle}
          mapContainerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: isFullscreen ? "0" : "8px",
            border: isFullscreen ? "none" : "1px solid #e5e7eb",
          }}
          center={markerPosition}
          zoom={15}
          // onClick={onMapClick}
          onLoad={(mapInstance) => setMap(mapInstance)}
          onIdle={() => {
            if (!map) return;

            if (debounceRef.current) clearTimeout(debounceRef.current);

            debounceRef.current = setTimeout(() => {
              const center = map.getCenter();
              if (!center) return;

              const lat = center.lat();
              const lng = center.lng();

              const newPos = { lat, lng };
              // setMarkerPosition(newPos);
              // we won't move marker since we have a fixed center marker, so no need to update its position in state.
              // We can directly reverse geocode using map center coordinates.

              getAddressFromLatLng(newPos);
            }, 500);
          }}
          options={{
            gestureHandling: "greedy",
            streetViewControl: false, // 👈 removes Pegman
            fullscreenControl: false, // CRITICAL: Disable Google's native fullscreen
            mapTypeControl: !isFullscreen, // Hide map type control in fullscreen for cleaner UI
          }}
        >
          {/* <Marker position={markerPosition} /> */}

          {/* Fixed center marker */}
          {/* lock it visually to center using CSS overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10">
            <img
              src="https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
              alt="marker"
              className="w-8 h-8"
            />
          </div>
        </GoogleMap>

        {/* Current-location button (top-right corner) */}
        {/* <button
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    className="absolute top-14 right-2 bg-white border shadow rounded-full p-2 hover:bg-gray-100"
                    title="Use current location"
                >
                    {
                        isLocating ? 
                        "…" 
                        : 
                        <LocateIcon/>
                    }
                </button> */}

        {/* Control Buttons Container */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Current Location Button */}
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="bg-white border shadow rounded-full p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-wait"
            title="Use current location"
            aria-label={isLocating ? "Locating..." : "Use current location"}
          >
            {isLocating ? (
              <div className="w-5 h-5 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
            ) : (
              <LocateIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            className="bg-white border shadow rounded-full p-2 hover:bg-gray-100"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-gray-700" />
            ) : (
              <Maximize2 className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPickerWithSearch;
