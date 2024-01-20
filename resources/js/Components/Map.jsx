import { useMemo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const Map = ({ center, businesses }) => {
    const options = useMemo(
        () => ({
            disableDefaultUI: false,
            clickableIcons: true,
            scrollwheel: false,
        }),
        [],
    );

    const handleMarkerClick = (id) => {
        const index = businesses.findIndex((el) => el.id === parseInt(id));
        console.log('click', index);
    };
    const onMarkerMouseOver = (id) => {
        console.log('mouseover', id);
    };

    return (
        <>
            {/* Important! Always set the container height explicitly */}
            <div>
                <GoogleMap
                    options={options}
                    center={center}
                    zoom={11}
                    mapContainerStyle={{ width: '100%', height: '66vh' }}
                    mapTypeId={google.maps.MapTypeId.ROADMAP}
                >
                    <Marker key={'center'} position={center} zIndex={3} />
                    {businesses.map((b, i) => {
                        let title = b.location.name;
                        return (
                            <Marker
                                key={b.id}
                                position={{
                                    lat: b.location.latitude,
                                    lng: b.location.longitude,
                                }}
                                title={title}
                                onClick={() => handleMarkerClick(b.id)}
                                onMouseOver={() => onMarkerMouseOver(b.id)}
                            />
                        );
                    })}
                </GoogleMap>
            </div>
        </>
    );
};
export default Map;
