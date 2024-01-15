import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axiosClient from '@/axios';
import BusinessList from '@/Components/BusinessList';

import { ChevronRightIcon } from '@heroicons/react/20/solid';

const BusinessLocator = () => {
    const [loading, setLoading] = useState(false);
    const [businesses, setBusinesses] = useState([]);

    const getBusinesses = (url) => {
        setLoading(true);
        url = url || '/businesses';
        axiosClient.get(url).then(({ data }) => {
            console.log(data);
            setBusinesses(data.data);
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

    useEffect(() => {
        getBusinesses();
    }, []);

    return (
        <>
            <Head title="Business Locator | Laravel/React" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-center text-brand-green-200 bg-gray-100 selection:bg-brand-orange/50 selection:text-white">
                <div className="w-full p-4">
                    {loading ? (
                        <div className="text-center text-lg">Loading...</div>
                    ) : (
                        <div>
                            <div className="flex flex-col lg:flex-row items-center mb-6">
                                <div className="w-full lg:w-1/2 md:flex md:flex-row items-center justify-center gap-3 mb-3 lg:mb-0">
                                    <div className="relative md:w-3/4">
                                        <div className="hidden md:block text-sm mb-2">
                                            Find business by location
                                        </div>
                                        <div className="border border-brand-green-light my-4 md:my-0 lg:border-0">
                                            [Place input]
                                        </div>
                                    </div>
                                    <div className="relative md:w-1/4">
                                        <div className="hidden md:block text-sm mb-2">
                                            Maximum Distance
                                        </div>
                                        <div className="border border-brand-green-light my-4 md:my-0  md:border-0">
                                            [Distance input]
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 flex flex-col md:flex-row items-center justify-center gap-3 lg:self-end lg:mb-1">
                                    <button
                                        className="md:block rounded-full bg-brand-green text-white px-4 py-2 font-bold"
                                        onClick={onClickFind}
                                    >
                                        Find a Business{' '}
                                        <ChevronRightIcon
                                            className="h-5 w-5 inline"
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <span
                                        className="uppercase hidden lg:inline font-bold text-brand-green-200"
                                        aria-hidden="true"
                                    >
                                        or
                                    </span>
                                    <button
                                        className="rounded-full border-2 border-brand-orange bg-white text-brand-orange px-4 py-2 capitalize font-bold"
                                        onClick={onClickLocate}
                                    >
                                        Use your location{' '}
                                    </button>{' '}
                                </div>
                            </div>
                            <div className="flex flex-row gap-3">
                                <div className="w-full md:basis-1/2 lg:basis-1/3 px-4">
                                    <div className="flex flex-row lg:flex-col items-start mb-6">
                                        <div className="font-semibold">N businenesses found</div>
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
                                    <div className="m-2 p-1 border border-brand-green-200">
                                        Map....
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default BusinessLocator;
