import { useState } from 'react';
import MapGL, { GeolocateControl } from 'react-map-gl';
import { Box } from '@chakra-ui/react';

const geolocateStyle = {
  top: 0,
  left: 0,
  margin: 10,
  display: 'none', // hide control
};
const initialViewportState = {
  latitude: 33.749,
  longitude: -84.38633,
  zoom: 12,
};

function DonorMap() {
  const [viewport, setViewport] = useState(initialViewportState);

  return (
    <Box pos="absolute" top="0" right="0" bottom="0" left="0">
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <GeolocateControl
          style={geolocateStyle}
          positionOptions={{
            enableHighAccuracy: true,
          }}
          auto
        />
      </MapGL>
    </Box>
  );
}

export default DonorMap;
