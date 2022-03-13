// import { useState } from 'react';
import MapGL, { GeolocateControl, Marker } from 'react-map-gl';
import { Box } from '@chakra-ui/react';
import Image from 'next/image';
import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { Chapter } from '@prisma/client';
import { DonorContext } from '@/providers/DonorProvider';
import { GetChapterResponse } from '@/pages/api/chapters';
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
  const { data, error } = useSWR<GetChapterResponse>(`/api/chapters`);

  // const { data } = useSWR<PostRecipientResponse>('api/recipients');
  // const { data } =  useSWR<GetDataResponse>('api/chapters/[chapterId]');

  // const response = await fetch(
  //   `/api/chapters/${currentChapter?.id}/recipients`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   },
  // );

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
