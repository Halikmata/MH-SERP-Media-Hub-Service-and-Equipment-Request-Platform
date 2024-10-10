import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { types } from './types.js';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

const AddItem = ({ url }) => {
    const { collection } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [foreignOptions, setForeignOptions] = useState({});
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [showOtherInput, setShowOtherInput] = useState({});

    const collectionTypes = types[collection] || {};

    useEffect(() => {
        const fetchForeignOptions = async () => {
            const promises = Object.entries(collectionTypes)
                .filter(([_, config]) => config.data_type === 'foreign_xor')
                .map(async ([field, config]) => {
                    try {
                        const response = await axios.get(`${url}${config.collection_option}`);
                        return { [field]: response.data };
                    } catch (error) {
                        console.error(`Error fetching ${config.collection_option} data:`, error);
                        return { [field]: [] };
                    }
                });

            const results = await Promise.all(promises);
            setForeignOptions(Object.assign({}, ...results));
        };

        const fetchDropdownOptions = async () => {
            const promises = Object.entries(collectionTypes)
                .filter(([_, config]) => config.data_type === 'dropdown' || config.data_type === 'autocomplete')
                .map(async ([field]) => {
                    try {
                        const response = await axios.get(`${url}get_distinct/${collection}/${field}`);
                        return { [field]: response.data };
                    } catch (error) {
                        console.error(`Error fetching distinct values for ${field}:`, error);
                        return { [field]: [] };
                    }
                });

            const results = await Promise.all(promises);
            setDropdownOptions(Object.assign({}, ...results));
        };

        fetchForeignOptions();
        fetchDropdownOptions();
    }, [collection, url, collectionTypes]);

    const onCancel = () => {
        navigate(`/admin/${collection}`);
    };

    const renderInput = (field, fieldConfig) => {
        const fieldType = fieldConfig["data_type"];
        const fieldValue = fieldConfig["option"] || [];

        switch (fieldType) {
            case 'text':
                return <input type="text" className="form-control m-2" name={field} onChange={handleChange} />;
            case 'date':
                return <input type="date" className="form-control m-2" name={field} onChange={handleChange} />;
            case 'number':
                return <input type="number" className="form-control m-2" name={field} onChange={handleChange} />;
            case 'xor':
                return (
                    <select name={field} onChange={handleChange} className="form-select m-2">
                        <option value="">Select...</option>
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
                            <div key={option} className="form-check form-check-inline">
                                <input type="checkbox" className="form-check-input" name={field} value={option} onChange={handleCheckboxChange} />
                                <label className="form-check-label">{option}</label>
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
                            <option value="">Select...</option>
                            <option value="DropdownOther">Add {fieldConfig.label}</option>
                            {dropdownValues.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {showOtherInput[field] && (
                            <input
                                type="text"
                                className="form-control m-2"
                                name={field}
                                placeholder="Type here"
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
        const fieldConfig = collectionTypes[name];

        let updatedValue = value;

        if (fieldConfig) {
            switch (fieldConfig.data_type) {
                case 'number':
                case 'foreign_xor':
                    updatedValue = Number(value);
                    break;
                case 'xor':
                    updatedValue = Number(value);
                    break;
                default:
                    break;
            }
        }

        setFormData({ ...formData, [name]: updatedValue }); // Update the state with the new value
    };

    const handleDropdownChange = (e, field) => {
        const value = e.target.value;

        if (value === "DropdownOther") {
            setShowOtherInput({ ...showOtherInput, [field]: true });
            setFormData({ ...formData, [field]: '' }); // Reset the field's value for custom input
        } else {
            setShowOtherInput({ ...showOtherInput, [field]: false });
            setFormData({ ...formData, [field]: value });
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        const currentValues = formData[name] || [];

        if (checked) {
            setFormData({ ...formData, [name]: [...currentValues, value] });
        } else {
            setFormData({ ...formData, [name]: currentValues.filter(val => val !== value) });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${url}${collection}/add`, formData)
            .then((response) => {
                console.log('Item added successfully:', response.data);
                navigate(`/admin/${collection}`);
            })
            .catch((error) => {
                console.error('Error adding item:', error);
            });
    };

    const renderForm = () => {
        return (
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <form onSubmit={handleSubmit}>
                                    {Object.entries(collectionTypes).map(([field, config]) => (
                                        <div key={field} className="mb-3">
                                            <label className="form-label">{config.label}: </label>
                                            {renderInput(field, config)}
                                        </div>
                                    ))}
                                    <Button className="m-2" type="submit">Submit</Button>
                                    <Button className="m-2" variant="secondary" onClick={onCancel}>Cancel</Button>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    };

    return (
        <div>
            <h2>Add {collection}</h2>
            {renderForm()}
        </div>
    );
};

export default AddItem;

const dropdownStyle = {
    maxHeight: '100px',
    overflowY: 'auto'
};
