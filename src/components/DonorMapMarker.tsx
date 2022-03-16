// import { useState } from 'react';
import MapGL, { GeolocateControl, Marker } from 'react-map-gl';
import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { Chapter } from '@prisma/client';
import { DonorContext } from '@/providers/DonorProvider';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';
// import recipients from '@/pages/api/recipients';
// import { PostRecipientResponse } from '@/pages/api/recipients';
// import { DataResponse } from '@/pages/api/chapters/[chapterId]';

interface DonorNavbarDropDownProps {
  recipient: DetailedRecipient;
}

type Coordinates = {
  longitude: number | 0;
  latitude: number | 0;
};

function DonorMapMarker({ recipient }: DonorNavbarDropDownProps) {
  const [recipientCoordinates, setRecipientCoordinates] = useState<Coordinates>(
    { longitude: 0, latitude: 0 },
  );
  const [active, setActive] = useState(false);

  const getCoordinates = async (rec: DetailedRecipient) => {
    const address = `${rec.primaryStreetAddress} ${rec.city} ${rec.state} ${rec.postalCode}`;
    const encodedAddr = encodeURI(address);

    try {
      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddr}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=true`;
      const response = await fetch(endpoint);
      const results = await response.json();
      return results;
    } catch (err) {
      console.log('Error fetching data, ', err);
      return '';
    }
  };

  useEffect(() => {
    getCoordinates(recipient).then((res) => {
      console.log([res.features[0].center]);
      const coords = {
        longitude: res.features[0].center[0],
        latitude: res.features[0].center[1],
      };
      setRecipientCoordinates(coords);
    });
  }, []);

  return (
    <Marker
      longitude={recipientCoordinates.longitude}
      latitude={recipientCoordinates.latitude}
    >
      <img src="/pin.png" width="41" height="60" />
    </Marker>
  );
}

export default DonorMapMarker;
