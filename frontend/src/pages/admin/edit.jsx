import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { types } from './types.js';

const EditItem = ({ url, renderSelectCell }) => {
    const { collection, id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);


    function onCancel() {
        navigate(`/admin/${collection}`);
    }

    useEffect(() => {
        // Fetch existing item's data
        axios.get(`${url}${collection}/update/${id}`)
            .then((response) => {
                setFormData(response.data); // Assuming the response contains item data
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching item:', error);
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
                            <div key={option}>
                                <input type="checkbox" name={field} value={option} checked={formData[field] && formData[field].includes(option)} onChange={handleCheckboxChange} />
                                <label>{option}</label>
                            </div>
                        ))}
                    </>
                );
            case 'foreign_xor':
                return (
                    <select name={field} value={formData[field] || ''} onChange={handleChange}>
                        <option value="">Select...</option>
                        {fieldValue.map((option) => (
                            <option key={option._id.$oid} value={option.fk_id}>
                                {`${option.name}`}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        const { name, value } = e.target;
        const isChecked = e.target.checked;
        const currentValues = formData[name] || [];
        let updatedValues;

        if (isChecked) {
            updatedValues = [...currentValues, value];
        } else {
            updatedValues = currentValues.filter((val) => val !== value);
        }

        setFormData({ ...formData, [name]: updatedValues });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`${url}${collection}/update/${id}`, formData)
            .then((response) => {
                console.log('Item updated successfully:', response.data);
                navigate(`/admin/${collection}`);
            })
            .catch((error) => {
                console.error('Error updating item:', error);
            });
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
                                            <label>{config["label"]}: </label>
                                            {renderInput(field, config)}
                                        </div>
                                    ))}
                                    <Button className="m-2" type="submit">Submit</Button>
                                    <Button className="m-2"variant="secondary" onClick={onCancel}>Cancel</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleSelectChange = (field, value) => {
        setFormData({ ...formData, [field]: value });

        axios.post(`${url}${collection}/update/${id}`, { [field]: value })
            .then((response) => {
                console.log('Item updated successfully:', response.data);
                navigate(`/admin/${collection}`);
            })
            .catch((error) => {
                console.error('Error updating item:', error);
            });
    };

    return (
        <div>
            <h2>Edit {collection}</h2>
            {renderForm()}
        </div>
    );
};

export default EditItem;
