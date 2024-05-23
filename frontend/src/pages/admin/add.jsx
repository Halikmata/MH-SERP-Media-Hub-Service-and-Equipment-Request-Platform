import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { types } from './types.js';
import { Button , Card, Col, Container, Row } from 'react-bootstrap';

const AddItem = ({ url }) => {
    const { collection } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});

    function onCancel() {
        navigate(`/admin/${collection}`);
    }

    const renderInput = (field, fieldConfig) => {
        const fieldType = fieldConfig["data_type"];
        const fieldValue = fieldConfig["option"];

        switch (fieldType) {
            case 'text':
                return <input type="text" className="form-control m-2" name={field} onChange={handleChange} />;
            case 'date':
                return <input type="date" className="form-control m-2" name={field} onChange={handleChange} />;
            case 'number':
                return <input type="number" className="form-control m-2" name={field} onChange={handleChange} />;
            case 'xor':
                return (
                    <select name={field} onChange={handleChange}>
                        <option value="">Select...</option>
                        {fieldValue.map((option) => (
                            <option key={option} value={option}>
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
                                <input type="checkbox" className='form-select' name={field} value={option} onChange={handleCheckboxChange} />
                                <label>{option}</label>
                            </div>
                        ))}
                    </>
                );
            case 'foreign_xor':
                return (
                    <select name={field} onChange={handleChange} className='form-select'>
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

    // Placeholder function for handling checkbox changes
    const handleCheckboxChange = (e) => {
        // Placeholder function
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
        const collectionTypes = types[collection] || {};
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
