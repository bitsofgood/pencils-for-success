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
  // const { data, error } = useSWR<DataResponse>(
  //   `/api/chapters/${activeChapterId}/recipients`,
  // );
  const [recipientCoordinates, setRecipientCoordinates] = useState([]);

  // const { data } = useSWR<PostRecipientResponse>('api/recipients');
  // const { data } =  useSWR<GetDataResponse>('api/chapters/[chapterId]');

  // const getRecipients = async (chapterId: number) => {
  //   // potentially add export
  //   if (!chapterId || chapterId < 0) {
  //     throw Error('Please provide a valid chapter id');
  //   }

  //   const response = await fetch(`/api/chapters/${chapterId}/recipients`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   const responseJson = await response.json();
  // if (response.status !== 200 || responseJson.error) {
  //   throw Error(responseJson.message);
  // }

  //   return responseJson.recipients as DetailedRecipient[];
  // };

  const getCoordinates = async () => {
    const response = await fetch(
      `/api/chapters/${activeChapterId}/recipients`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const responseJson = await response.json();
    if (response.status !== 200 || responseJson.error) {
      throw Error(responseJson.message);
    }

    let address = '';
    const recipients = responseJson.recipients as DetailedRecipient[];
    recipients.forEach((recipient) => {
      address += encodeURI(
        `${recipient.primaryStreetAddress}, ${recipient.city}, ${recipient.state} ${recipient.postalCode}`,
      ).concat(';');
    });

    console.log(address);

    const encodedAddr = encodeURI(address);
    console.log(encodedAddr);
    // try {
    //   const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places-permanent/${encodedAddr}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=true`;
    //   const response = await fetch(endpoint);
    //   const results = await response.json();
    // } catch (err) {
    //   console.log('Error fetching data, ', err);
    // }
  };

  useEffect(() => {
    // call get recipients here
    // const recipients = getRecipients(activeChapterId);
    getCoordinates()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
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
        geo
        <Marker longitude={-100} latitude={40}>
          <Image src="/pin.png" width="41" height="60" />
        </Marker>
      </MapGL>
    </Box>
  );
}

export default DonorMap;
