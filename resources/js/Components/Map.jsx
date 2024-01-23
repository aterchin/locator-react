import { useMemo, useCallback, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import pinActive from '../../svg/noun-map-pin.svg';
import pinInactive from '../../svg/noun-map-pin-inactive.svg';
import pinCenter from '../../svg/pin.svg';

const Map = ({ center, businesses, fromTo, active, onToggleActive }) => {
    const mapRef = useRef();
    const options = useMemo(
        () => ({
            disableDefaultUI: false,
            clickableIcons: true,
            scrollwheel: false,
        }),
        [],
    );

    const onLoad = useCallback((map) => {
        mapRef.current = map;
        // make sure you have at least one result before fitting bounds
        if (businesses && businesses.length > 0) {
            fitBounds();
        }
    }, []);

    const fitBounds = () => {
        const bounds = new window.google.maps.LatLngBounds();
        businesses?.forEach(({ location }) =>
            bounds.extend({ lat: location.latitude, lng: location.longitude }),
        );
        mapRef.current.fitBounds(bounds);
    };

    const handleMarkerClick = (id) => {
        //const index = businesses.findIndex((el) => el.id === parseInt(id));
        onToggleActive(id);
    };
    // const onMarkerMouseOver = (id) => {
    //     //console.log('mouseover', id);
    // };

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
                    onLoad={onLoad}
                >
                    <Marker key={'center'} icon={markerCenter} position={center} zIndex={3} />
                    {businesses.map((b, i) => {
                        let title = String(i + fromTo[0]) + '. ' + b.location.address;
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
                                //onMouseOver={() => onMarkerMouseOver(b.id)}
                                zIndex={active === b.id ? 2 : 1}
                            />
                        );
                    })}
                </GoogleMap>
            </div>
        </>
    );
};
export default Map;
