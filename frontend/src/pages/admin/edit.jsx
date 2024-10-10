import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { types } from './types.js';

const EditItem = ({ url }) => {
    const { collection, id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [loading, setLoading] = useState(true);
    const [foreignOptions, setForeignOptions] = useState({});
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [showOtherInput, setShowOtherInput] = useState({});

    const onCancel = () => {
        navigate(`/admin/${collection}`);
    };

    useEffect(() => {
        // Fetch existing item's data
        axios.get(`${url}${collection}/update/${id}`)
            .then((response) => {
                setFormData(response.data); // Set form data to the fetched item data
                setOriginalData(response.data); // Store original data for comparison
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching item:', error);
            });

        // Fetch foreign_xor options for each relevant field
        const collectionTypes = types[collection] || {};
        const foreignXorFields = Object.entries(collectionTypes)
            .filter(([field, config]) => config.data_type === 'foreign_xor');

        foreignXorFields.forEach(([field, config]) => {
            const collectionOption = config.collection_option;
            axios.get(`${url}${collectionOption}`)
                .then((response) => {
                    setForeignOptions(prevState => ({
                        ...prevState,
                        [field]: response.data
                    }));
                })
                .catch((error) => {
                    console.error(`Error fetching ${collectionOption} data:`, error);
                });
        });

        // Fetch distinct values for each 'dropdown' field
        const dropdownFields = Object.entries(collectionTypes)
            .filter(([field, config]) => config.data_type === 'dropdown');

        dropdownFields.forEach(([field]) => {
            axios.get(`http://127.0.0.1:5000/get_distinct/${collection}/${field}`)
                .then((response) => {
                    setDropdownOptions(prevState => ({
                        ...prevState,
                        [field]: response.data
                    }));
                })
                .catch((error) => {
                    console.error(`Error fetching distinct values for ${field}:`, error);
                });
        });
    }, [id, collection, url]);

    const renderInput = (field, fieldConfig) => {
        const fieldType = fieldConfig["data_type"];
        const fieldValue = fieldConfig["option"];

        switch (fieldType) {
            case 'text':
            case 'date':
            case 'number':
                return <input className="form-control m-2" type={fieldType} name={field} value={formData[field] || ''} onChange={handleChange} />;
            case 'xor':
                return (
                    <select className='form-select' name={field} value={formData[field] || ''} onChange={handleChange}>
                        {fieldValue.map((option, index) => (
                            <option key={option} value={index}>
                                {option}
                            </option>
                        ))}
                    </select>
                );
            case 'or':
                return (
                    <>
                        {fieldValue.map((option) => (
                            <div key={option}>
                                <input type="checkbox" name={field} value={option} checked={formData[field] && formData[field].includes(option)} onChange={handleCheckboxChange} />
                                <label>{option}</label>
                            </div>
                        ))}
                    </>
                );
            case 'foreign_xor':
                const options = foreignOptions[field] || [];
                const identifier = fieldConfig.identifier;

                return (
                    <select
                        name={field}
                        className='form-select m-2'
                        onChange={handleChange}
                        value={formData[field] || ''} // Ensure the selected option is the current value
                    >
                        <option value="">Select...</option>
                        {options.map((option) => (
                            <option key={option._id.$oid} value={option[identifier]}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                );
            case 'dropdown':
                const dropdownValues = dropdownOptions[field] || [];

                return (
                    <>
                        <select
                            name={field}
                            className='form-select m-2'
                            style={dropdownStyle}
                            onChange={(e) => handleDropdownChange(e, field)}
                            value={formData[field] || ''}
                        >
                            {dropdownValues.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                            <option value="Other">other (add)</option>
                        </select>
                        {showOtherInput[field] && (
                            <input
                                type="text"
                                className="form-control m-2"
                                name={field}
                                placeholder="Specify other..."
                                onChange={handleChange}
                                value={formData[field] || ''}
                            />
                        )}
                    </>
                );


            default:
                return null;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDropdownChange = (e, field) => {
        const value = e.target.value;

        if (value === "Other") {
            setShowOtherInput({ ...showOtherInput, [field]: true });
            setFormData({ ...formData, [field]: '' }); // Reset the field's value for custom input
        } else {
            setShowOtherInput({ ...showOtherInput, [field]: false });
            setFormData({ ...formData, [field]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create an object to hold only the changed values
        const updatedData = Object.keys(formData).reduce((acc, key) => {
            if (formData[key] !== originalData[key]) {
                acc[key] = formData[key]; // Keep the original type
            }
            return acc;
        }, {});

        // Proceed to update if there are any changed values
        if (Object.keys(updatedData).length > 0) {
            axios.put(`${url}${collection}/update/${id}`, updatedData)
                .then((response) => {
                    console.log('Item updated successfully:', response.data);
                    navigate(`/admin/${collection}`);
                })
                .catch((error) => {
                    console.error('Error updating item:', error);
                });
        } else {
            console.log('No changes made to the item.');
            navigate(`/admin/${collection}`); // Navigate back if no changes
        }
    };

    const renderForm = () => {
        if (loading) {
            return <div>Loading...</div>;
        }

        const collectionTypes = types[collection] || {};
        return (
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card mt-5'>
                            <div className='card-body'>
                                <form onSubmit={handleSubmit}>
                                    {Object.entries(collectionTypes).map(([field, config]) => (
                                        <div key={field}>
                                            <label>{config.label}: </label>
                                            {config.editable === 1 ? (
                                                renderInput(field, config)
                                            ) : (
                                                <span> <b>{formData[field]}</b></span>
                                            )}
                                        </div>
                                    ))}
                                    <Button className="m-2" type="submit">Submit</Button>
                                    <Button className="m-2" variant="secondary" onClick={onCancel}>Cancel</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h2>Edit {collection}</h2>
            {renderForm()}
        </div>
    );
};

export default EditItem;

const dropdownStyle = {
    maxHeight: '100px',
    overflowY: 'auto'
};