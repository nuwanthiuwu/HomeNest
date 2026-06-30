// /client/src/components/checkout/ShippingForm.jsx
import React, { useState, useEffect } from 'react';

const REQUIRED = ['fullName', 'addressLine1', 'city', 'state', 'zipCode', 'country'];

const FIELDS = [
  { name: 'fullName', label: 'Full Name', placeholder: 'Jane Doe', colSpan: 2 },
  { name: 'addressLine1', label: 'Address Line 1', placeholder: '123 Main St', colSpan: 2 },
  { name: 'addressLine2', label: 'Address Line 2 (optional)', placeholder: 'Apt 4B', colSpan: 2 },
  { name: 'city', label: 'City', placeholder: 'New York', colSpan: 1 },
  { name: 'state', label: 'State / Province', placeholder: 'NY', colSpan: 1 },
  { name: 'zipCode', label: 'ZIP / Postal Code', placeholder: '10001', colSpan: 1 },
  { name: 'country', label: 'Country', placeholder: 'US', colSpan: 1 },
];

export default function ShippingForm({ initialValues = {}, onSubmit }) {
  const [form, setForm] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    ...initialValues,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setForm((prev) => ({ ...prev, ...initialValues }));
    }
  }, [JSON.stringify(initialValues)]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    REQUIRED.forEach((field) => {
      if (!form[field]?.trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map(({ name, label, placeholder, colSpan }) => (
          <div key={name} className={colSpan === 2 ? 'col-span-2' : 'col-span-1'}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={form[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors[name] && (
              <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Continue to Review →
      </button>
    </form>
  );
}
