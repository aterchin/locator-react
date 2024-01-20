import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import axiosClient from '@/axios';

import BusinessList from '@/Components/BusinessList';
import PaginationLinks from '@/Components/PaginationLinks';
import Map from '@/Components/Map';

import { ChevronRightIcon } from '@heroicons/react/20/solid';

const Locator = () => {
    const [loading, setLoading] = useState(false);

    // NYC
    const [center, setCenter] = useState({ lat: 40.7639, lng: -73.9794 });

    const [businesses, setBusinesses] = useState([]);
    const [meta, setMeta] = useState({});

    // active: business id (int) or null
    const [active, setActive] = useState(null);

    // Google Places API
    const libraries = useMemo(() => ['places', 'geometry'], []);
    const mapLoader = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: libraries,
    });

    const getBusinesses = (url) => {
        setLoading(true);
        url = url || '/locations';
        axiosClient.get(url).then(({ data }) => {
            console.log(data);
            setBusinesses(data.data);
            setMeta(data.meta);
            setLoading(false);
        });
    };

    const onClickFind = () => {
        // get businesses based off params
        console.log('finding based off params...');
    };

    const onClickLocate = () => {
        console.log('getting your geolocation from browser...');
    };

    const onClickPage = (link) => {
        console.log('pagination clicked: ', link);
    };

    const toggleActive = (id) => {
        setActive(id);
    };

    useEffect(() => {
        getBusinesses();
    }, []);

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
                                                [Place input]
                                            </div>
                                        </div>
                                        <div className="relative md:w-1/4">
                                            <div className="hidden md:block text-sm mb-2">
                                                Maximum Distance
                                            </div>
                                            <div className="border border-brand-primary-light my-4 md:my-0  md:border-0">
                                                [Distance input]
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
                                            <div className="font-semibold">N results found</div>
                                            <div>within N miles of X</div>
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
                                                <BusinessList businesses={businesses} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="hidden md:block md:basis-1/2 lg:basis-3/4">
                                        <div className="m-2 p-1 border border-brand-primary-200">
                                            <div id="main-map">
                                                <Map
                                                    center={center}
                                                    businesses={businesses}
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
