import { useMemo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import pinActive from '../../svg/noun-map-pin.svg';
import pinInactive from '../../svg/noun-map-pin-inactive.svg';
import pinCenter from '../../svg/pin.svg';

const Map = ({ center, businesses, active, onToggleActive }) => {
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

        onToggleActive(id);
    };
    const onMarkerMouseOver = (id) => {
        console.log('mouseover', id);
    };

    const markerCenter = {
        url: pinCenter,
        scaledSize: new google.maps.Size(30, 30),
    };

    const markerInactive = {
        url: pinInactive,
        scaledSize: new google.maps.Size(50, 50),
    };

    const markerActive = {
        url: pinActive,
        scaledSize: new google.maps.Size(60, 60),
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
                    <Marker key={'center'} icon={markerCenter} position={center} zIndex={3} />
                    {businesses.map((b, i) => {
                        let title = b.location.name;
                        return (
                            <Marker
                                key={b.id}
                                position={{
                                    lat: b.location.latitude,
                                    lng: b.location.longitude,
                                }}
                                icon={active === b.id ? markerActive : markerInactive}
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
