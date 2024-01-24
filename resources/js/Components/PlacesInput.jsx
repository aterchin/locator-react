import { Combobox } from '@headlessui/react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const PlacesInput = ({ setCoordinates, setPlace }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete({
        cacheKey: 'us-ca',
        cache: 24 * 60 * 60,
        requestOptions: {
            strictBounds: false,
            types: ['geocode'],
            componentRestrictions: { country: ['us', 'ca'] },
        },
    });

    const handleChange = async (address) => {
        // false to prevent fetch of additional data
        setValue(address, false);
        clearSuggestions();

        const results = await getGeocode({ address });
        const { lat, lng } = getLatLng(results[0]);
        setCoordinates({ lat, lng });
        setPlace(address);
    };

    return (
        <Combobox value={value} onChange={handleChange}>
            <Combobox.Input
                displayValue={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready}
                className="w-full rounded-lg bg-white py-4 pl-3 pr-10 border-0 shadow-sm outline-none focus:ring-2 focus:ring-brand-primary sm:text-sm placeholder:text-brand-secondary-200/70"
                placeholder="Enter ZIP, City and State or Street Address"
            />
            <Combobox.Options className="absolute max-h-60 w-full overflow-auto rounded-lg bg-white my-3 text-base shadow-lg z-10">
                {status === 'OK' &&
                    data.map(({ place_id, description }) => (
                        <Combobox.Option
                            key={place_id}
                            value={description}
                            className={({ active }) =>
                                `relative cursor-default select-none py-3 pl-6 pr-6 ${
                                    active ? 'bg-brand-primary text-white' : 'text-gray-900'
                                }`
                            }
                        >
                            {description}
                        </Combobox.Option>
                    ))}
            </Combobox.Options>
        </Combobox>
    );
};
export default PlacesInput;
