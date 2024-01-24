import { useRef } from 'react';
import BusinessListItem from './BusinessListItem';

const BusinessList = ({ businesses, active, onToggleActive }) => {
    const itemsRef = useRef(null);

    //react.dev/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
    function scrollToId(itemId) {
        const map = getMap();
        const node = map.get(itemId);
        node.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });
    }

    function getMap() {
        if (!itemsRef.current) {
            // Initialize the Map on first usage.
            itemsRef.current = new Map();
        }
        return itemsRef.current;
    }

    const renderedItems = businesses.map((business) => {
        if (active === business.id) {
            scrollToId(business.id);
        }

        return (
            <div
                className="first:mt-0 mt-3"
                key={business.id}
                ref={(node) => {
                    const map = getMap();
                    if (node) {
                        map.set(business.id, node);
                    } else {
                        map.delete(business.id);
                    }
                }}
            >
                <BusinessListItem
                    business={business}
                    active={active}
                    onToggleActive={onToggleActive}
                />
            </div>
        );
    });

    return <>{renderedItems}</>;
};

export default BusinessList;
