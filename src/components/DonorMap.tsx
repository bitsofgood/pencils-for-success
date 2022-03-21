// import { useState } from 'react';
import MapGL, { GeolocateControl, WebMercatorViewport } from 'react-map-gl';
import { Box } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { DonorContext } from '@/providers/DonorProvider';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';
import DonorMapMarker, { Coordinates } from './DonorMapMarker';

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
  const { activeChapterId } = useContext(DonorContext);
  const [recipients, setRecipients] = useState<DetailedRecipient[]>([]);
  const [activeMarkerId, setActiveMarkerId] = useState(-1);
  const [markerCoordinates, setMarkerCoordinates] = useState<Coordinates[]>([]);

  const getRecipients = async () => {
    const res = await fetch(`/api/chapters/${activeChapterId}/recipients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const resJson = await res.json();
    if (res.status !== 200 || resJson.error) {
      throw Error(resJson.message);
    }
    return resJson.recipients as DetailedRecipient[];
  };

  const addMarkerCoordinates = (coords: Coordinates) => {
    const currentCoords = markerCoordinates;
    currentCoords.push(coords);
    setMarkerCoordinates(currentCoords);
    console.log(currentCoords);
  };

  useEffect(() => {
    getRecipients().then((res) => setRecipients(res));
    setActiveMarkerId(-1);
    setMarkerCoordinates([]);
  }, [activeChapterId]);

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
        {recipients.map((recipient) => (
          <DonorMapMarker
            key={recipient.id}
            id={recipient.id}
            recipient={recipient}
            activeMarkerId={activeMarkerId}
            setMarkerId={setActiveMarkerId}
            addMarkerCoord={addMarkerCoordinates}
          />
        ))}
      </MapGL>
    </Box>
  );
}

export default DonorMap;
