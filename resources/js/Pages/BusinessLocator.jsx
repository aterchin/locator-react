import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axiosClient from '@/axios';

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

    useEffect(() => {
        getBusinesses();
    }, []);

    return (
        <>
            <Head title="Business Locator | Laravel/React" />
            <h1>Welcome</h1>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque eveniet mollitia
                eaque alias vitae expedita voluptatibus ipsa. Quidem animi accusantium voluptas
                ullam odio similique, pariatur numquam dolor mollitia. Accusamus, impedit.
            </p>
        </>
    );
};
export default BusinessLocator;
