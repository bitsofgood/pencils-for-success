// import { useState } from 'react';
import MapGL, { GeolocateControl, Marker } from 'react-map-gl';
import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { Chapter } from '@prisma/client';
import { DonorContext } from '@/providers/DonorProvider';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';
import DonorMapMarker from './DonorMapMarker';
// import recipients from '@/pages/api/recipients';
// import { PostRecipientResponse } from '@/pages/api/recipients';
// import { DataResponse } from '@/pages/api/chapters/[chapterId]';

interface DonorNavbarDropDownProps {
  currentChapter: Chapter | undefined;
}

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

function DonorMap({ currentChapter }: DonorNavbarDropDownProps) {
  const [viewport, setViewport] = useState(initialViewportState);
  const [infoView, setInfoView] = useState(true);
  const { activeChapterId } = useContext(DonorContext);

  const [recipientCoordinates, setRecipientCoordinates] = useState([]);
  const [recipients, setRecipients] = useState<DetailedRecipient[]>([]);

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

  useEffect(() => {
    getRecipients().then((res) => setRecipients(res));
  }, []);

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
          <DonorMapMarker key={recipient.id} recipient={recipient} />
        ))}
      </MapGL>
    </Box>
  );
}

export default DonorMap;
