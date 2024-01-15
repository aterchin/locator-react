const BusinessListItem = ({ business }) => {
    return (
        <div className="h-24 p-2 border-t border-gray-300/20 mt-4 first:mt-0 text-gray-500 text-sm leading-relaxed">
            <h3>{business.name}</h3>
            {business.location.address}
        </div>
    );
};
export default BusinessListItem;
