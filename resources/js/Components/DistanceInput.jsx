import { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

const items = [
    { value: 1, label: '1 Mile' },
    { value: 2, label: '2 Miles' },
    { value: 5, label: '5 Miles' },
    { value: 10, label: '10 Miles' },
    { value: 50, label: '50 Miles' },
    { value: 100, label: '100 Miles' },
];

const DistanceInput = ({ distance, setDistance }) => {
    let found = items.find((el) => {
        return el.value === distance;
    });
    const [selected, setSelected] = useState(found);

    const handleChange = (obj) => {
        setSelected(obj);
        setDistance(obj.value);
    };
    return (
        <Listbox value={selected} onChange={handleChange}>
            <Listbox.Button className="relative w-full rounded-lg bg-white py-4 pl-3 pr-10 shadow-md focus:outline-none focus:ring-2 focus:ring-xeomin-pink sm:text-sm text-xeomin-blue-200">
                <span className="block truncate">{selected.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                </span>
            </Listbox.Button>
            <Listbox.Options className="absolute max-h-60 w-full overflow-auto rounded-lg bg-white my-3 text-base shadow-lg z-10">
                {items.map((item, i) => (
                    <Listbox.Option
                        key={i}
                        value={item}
                        className={({ active }) =>
                            `relative cursor-default select-none py-3 pl-6 pr-6 ${
                                active ? 'bg-brand-primary text-white' : 'text-gray-900'
                            }`
                        }
                    >
                        {item.label}
                    </Listbox.Option>
                ))}
            </Listbox.Options>
        </Listbox>
    );
};
export default DistanceInput;
