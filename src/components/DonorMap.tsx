import MapGL from 'react-map-gl';
import { Box } from '@chakra-ui/react';

function DonorMap() {
  return (
    <Box pos="absolute" top="0" right="0" bottom="0" left="0">
      <MapGL
        width="100%"
        height="100%"
        mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      />
    </Box>
  );
}

export default DonorMap;
