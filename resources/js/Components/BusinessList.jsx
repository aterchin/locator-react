import BusinessListItem from './BusinessListItem';

const BusinessList = ({ businesses, active, onToggleActive }) => {
    const renderedItems = businesses.map((business) => {
        return (
            <BusinessListItem
                key={business.id}
                business={business}
                active={active}
                onToggleActive={onToggleActive}
            />
        );
    });

    return <>{renderedItems}</>;
};

export default BusinessList;
