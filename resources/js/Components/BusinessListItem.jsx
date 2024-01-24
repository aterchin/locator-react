const BusinessListItem = ({ business, active, onToggleActive, className = '' }) => {
    const handleClick = (id) => {
        onToggleActive(id);
    };

    return (
        <div
            className={
                'business-list-item flex flex-col justify-between h-32 p-2 mx-4 mb-4 text-sm leading-snug ' +
                (active === business.id
                    ? 'active bg-brand-primary-light/20 focus:bg-brand-primary-light/30'
                    : 'inactive hover:bg-brand-secondary-light/20 focus:bg-brand-secondary-light') +
                className
            }
            onClick={() => handleClick(business.id)}
        >
            <div>
                <h3>{business.name}</h3>
                {business.location.address}
            </div>
            <div>{business.distance} miles</div>
        </div>
    );
};
export default BusinessListItem;
