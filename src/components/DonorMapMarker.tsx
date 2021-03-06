import { Marker } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { DetailedRecipient } from '@/pages/api/chapters/[chapterId]/recipients';
import MarkerInfoCard from './MarkerInfoCard';

interface DonorMapMarkerProps {
  recipient: DetailedRecipient;
  activeMarkerId: number;
  id: number;
  setMarkerId: (id: number) => void;
  addMarkerCoord: (coord: Coordinates) => void;
}
export type Coordinates = {
  longitude: number | 0;
  latitude: number | 0;
};
function DonorMapMarker({
  recipient,
  id,
  activeMarkerId,
  setMarkerId,
  addMarkerCoord,
}: DonorMapMarkerProps) {
  const [recipientCoordinates, setRecipientCoordinates] = useState<Coordinates>(
    { longitude: 0, latitude: 0 },
  );
  const [clicked, setClicked] = useState(false);

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

  const handleMarkerClick = (markerId: number) => {
    const prevClicked = clicked;
    if (prevClicked) {
      setMarkerId(-1);
    } else {
      setMarkerId(markerId);
    }
    setClicked(!clicked);
  };

  useEffect(() => {
    getCoordinates(recipient).then((res) => {
      const coords = {
        longitude: res.features[0].center[0],
        latitude: res.features[0].center[1],
      };
      setRecipientCoordinates(coords);
      addMarkerCoord(coords);
    });
  }, []);

  useEffect(() => {
    if (activeMarkerId !== id) {
      setClicked(false);
    }
  }, [activeMarkerId]);

  return (
    <>
      {clicked && <MarkerInfoCard recipient={recipient} isActive />}
      <Marker
        longitude={recipientCoordinates.longitude}
        latitude={recipientCoordinates.latitude}
        onClick={() => handleMarkerClick(id)}
      >
        <img
          src={activeMarkerId === id ? '/pin.png' : '/mark.png'}
          width="41"
          height="60"
        />
      </Marker>
    </>
  );
}
export default DonorMapMarker;
