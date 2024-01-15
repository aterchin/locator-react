import BusinessListItem from './BusinessListItem';

const BusinessList = ({ businesses }) => {
    const renderedItems = businesses.map((b) => {
        return <BusinessListItem key={b.id} business={b} />;
    });

    return <>{renderedItems}</>;
};

export default BusinessList;
