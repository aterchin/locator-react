import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import axiosClient from '@/axios';

import BusinessList from '@/Components/BusinessList';
import PaginationLinks from '@/Components/PaginationLinks';
import PlacesInput from '@/Components/PlacesInput';
import DistanceInput from '@/Components/DistanceInput';
import Map from '@/Components/Map';

import { ChevronRightIcon } from '@heroicons/react/20/solid';

const Locator = () => {
    const [loading, setLoading] = useState(false);
    const [businesses, setBusinesses] = useState([]);

    // Result meta data (obj)
    const [meta, setMeta] = useState({});
    // [start, end] per paginated page
    const [fromTo, setFromTo] = useState([0, 0]);

    // NYC (default)
    // { lat: (int), lng: (int) } (obj)
    const [coordinates, setCoordinates] = useState({ lat: 40.7639, lng: -73.9794 });
    const [place, setPlace] = useState('20 W 34th St., New York, NY 10001');
    // miles from center (int)
    const [distance, setDistance] = useState(10);

    // active: business id (int) or null
    const [active, setActive] = useState(null);

    const [search, setSearch] = useState({});

    // Google Places API

    // ...google maps' geometry used in calcDistance() v Haversine
    const libraries = useMemo(() => ['places', 'geometry'], []);
    const mapLoader = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    const calcDistance = (p1, p2) => {
        if (typeof google != 'undefined') {
            var d = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
            return d * 0.00062137; // meters to miles
        } else {
            return 0;
        }
    };
    const getBusinesses = (url, params) => {
        setLoading(true);
        url = url || '/locations';
        params = params || { coordinates, place, distance };
        //console.log(params);
        axiosClient
            .get(url, { params })
            .then(({ data }) => {
                const pointA = params.coordinates;
                const updatedBusinesses = data.data.map((business, i) => {
                    const pointB = {
                        lat: business.location.latitude,
                        lng: business.location.longitude,
                    };
                    return { ...business, distance: calcDistance(pointA, pointB).toFixed(2) };
                });
                updatedBusinesses.sort((a, b) => a.distance - b.distance);
                setBusinesses(updatedBusinesses);
                setMeta(data.meta);
                setFromTo([data.meta.from, data.meta.to]);
                // to update our front-facing components
                setSearch(data.search);
                // so if you do the same search no one is active
                setActive(null);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const onClickFind = () => {
        // get businesses based off params
        getBusinesses('/locations');
    };

    const onClickLocate = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
        } else {
            const options = {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0,
            };
            setLoading(true);
            getPosition(options)
                .then((position) => {
                    const { coords } = position;
                    // we don't need to call getBusinesses because
                    // in useEffect, page will re-render when coordinates change
                    setCoordinates({ lat: coords.latitude, lng: coords.longitude });
                    setPlace('your location');
                    setDistance(distance);
                })
                .catch((err) => {
                    setLoading(false);
                    console.error(`ERROR(${err.code}): ${err.message}`);
                    alert('Unable to retrieve your location');
                });
        }
    };

    function getPosition(options) {
        return new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, options),
        );
    }

    const onClickPage = (link) => {
        getBusinesses(link.url);
    };

    const toggleActive = (id) => {
        setActive(id);
    };

    useEffect(() => {
        getBusinesses();
    }, [coordinates]);

    return (
        <>
            <Head title="Locator | Laravel/React" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-center text-brand-primary-200 bg-gray-100 selection:bg-brand-secondary/50 selection:text-white">
                <div className="w-full p-4">
                    {loading ? (
                        <div className="text-center text-lg">Loading...</div>
                    ) : (
                        mapLoader.isLoaded && (
                            <div>
                                <div className="flex flex-col lg:flex-row items-center mb-6">
                                    <div className="w-full lg:w-1/2 md:flex md:flex-row items-center justify-center gap-3 mb-3 lg:mb-0">
                                        <div className="relative md:w-3/4">
                                            <div className="hidden md:block text-sm mb-2">
                                                Find business by location
                                            </div>
                                            <div className="border border-brand-primary-light my-4 md:my-0 lg:border-0">
                                                <PlacesInput
                                                    setCoordinates={setCoordinates}
                                                    setPlace={setPlace}
                                                    placeholder={search.place}
                                                />
                                            </div>
                                        </div>
                                        <div className="relative md:w-1/4">
                                            <div className="hidden md:block text-sm mb-2">
                                                Maximum Distance
                                            </div>
                                            <div className="border border-brand-primary-light my-4 md:my-0  md:border-0">
                                                <DistanceInput
                                                    distance={distance}
                                                    setDistance={setDistance}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full lg:w-1/2 flex flex-col md:flex-row items-center justify-center gap-3 lg:self-end lg:mb-1">
                                        <button
                                            className="md:block rounded-full bg-brand-primary text-white px-4 py-2 font-bold"
                                            onClick={onClickFind}
                                        >
                                            Find a Business{' '}
                                            <ChevronRightIcon
                                                className="h-5 w-5 inline"
                                                aria-hidden="true"
                                            />
                                        </button>
                                        <span
                                            className="uppercase hidden lg:inline font-bold text-brand-primary-200"
                                            aria-hidden="true"
                                        >
                                            or
                                        </span>
                                        <button
                                            className="rounded-full border-2 border-brand-secondary bg-white text-brand-secondary px-4 py-2 capitalize font-bold"
                                            onClick={onClickLocate}
                                        >
                                            Use your location{' '}
                                        </button>{' '}
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3">
                                    <div className="w-full md:basis-1/2 lg:basis-1/3 px-4">
                                        <div className="flex flex-row lg:flex-col items-start mb-6">
                                            <div className="font-semibold">
                                                {meta.total} results found
                                            </div>
                                            <div>
                                                {search.place &&
                                                    ` within ${String(
                                                        search.distance,
                                                    )} miles from ${search.place}`}
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto overscroll-contain h-[60vh]">
                                            {!businesses || businesses.length === 0 ? (
                                                <div className="mt-5">
                                                    <p className="text-lg">No results.</p>
                                                    <p>
                                                        Try changing the distance or do a different
                                                        search.
                                                    </p>
                                                </div>
                                            ) : (
                                                <BusinessList
                                                    businesses={businesses}
                                                    active={active}
                                                    onToggleActive={toggleActive}
                                                    origin={search.place}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="hidden md:block md:basis-1/2 lg:basis-3/4">
                                        <div className="m-2 p-1 border border-brand-primary-200">
                                            <div id="main-map">
                                                <Map
                                                    center={
                                                        search.coordinates
                                                            ? search.coordinates
                                                            : coordinates
                                                    }
                                                    businesses={businesses}
                                                    fromTo={fromTo}
                                                    active={active}
                                                    onToggleActive={toggleActive}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <PaginationLinks meta={meta} onClickPage={onClickPage} />
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
};
export default Locator;
