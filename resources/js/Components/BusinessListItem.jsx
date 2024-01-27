import { MapIcon } from '@heroicons/react/20/solid';
import pinActive from '../../svg/noun-map-pin.svg';

const BusinessListItem = ({ business, active, onToggleActive, origin, className = '' }) => {
    const handleClick = (id) => {
        onToggleActive(id);
    };

    function directionsUrl(origin, destination) {
        let url = 'https://www.google.com/maps/dir/?api=1';
        let o = encodeURIComponent(origin);
        let d = encodeURIComponent(destination);

        return `${url}&origin=${o}&destination=${d}`;
    }

    return (
        <div
            className={
                'flex flex-col justify-between h-32 p-2 mx-4 mb-4 text-sm leading-snug ' +
                (active === business.id
                    ? 'active bg-brand-primary/10 focus:bg-brand-primary-light/30'
                    : 'inactive hover:bg-brand-primary/10 focus:bg-brand-secondary-light border border-brand-primary/30') +
                className
            }
            onClick={() => handleClick(business.id)}
        >
            <h3>{business.name}</h3>
            <div className="flex flex-row items-start">
                <img src={pinActive} className="w-4 inline-block mr-2" aria-hidden="true" />
                <div className="flex-1">{business.location.address}</div>
            </div>
            <div className="flex flex-row items-center justify-between mt-2">
                <div>
                    <MapIcon className="w-4 inline-block mr-2" aria-hidden="true" />
                    <a
                        href={directionsUrl(origin, business.location.address)}
                        target="_blank"
                        className="inline-block text-green-800 font-bold"
                    >
                        Get Directions
                    </a>
                </div>
                <div>{business.distance} miles</div>
            </div>
        </div>
    );
};
export default BusinessListItem;
