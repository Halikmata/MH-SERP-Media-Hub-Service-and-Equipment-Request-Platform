import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { types } from './types_beta';

const Item = ({ url, columns }) => {
    const { collection, id } = useParams();
    const navigate = useNavigate();
    const [itemInfo, setItemInfo] = useState({});
    const [loading, setLoading] = useState(true);

    const collectionTypes = types[collection]

    useEffect(() => {
        axios.get(`${url}/${collection}/${id}`)
            .then((response) => {
                setItemInfo(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching item:', error);
            });
    }, [id, collection, url]);

    function onCancel() {
        navigate(`/admin/${collection}`);
    }

    const renderData = (data, type) => {
        if (type === 'datetime') {
            const date = new Date(data);
            return <h5>{date.toLocaleString()}</h5>;
        } else if (type === 'date') {
            const date = new Date(data);
            return <h5>{date.toLocaleDateString()}</h5>;
        } else if (type === 'list') {
            const items = data.map(item => item.toString()).join('\n');
            return <pre><h5>{items}</h5></pre>;
        }
        return <h5>{data}</h5>;
    }

    return (
        <div className='container'>
            <h2>{collection}</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {Object.entries(collectionTypes).map(([field, config]) => (
                        <div key={field}>
                            <p className='mt-4 mb-0'>{config["label"]}</p>
                            {config["data_type"] == "text" ?
                                <h5>{itemInfo[field]}</h5> : renderData(itemInfo[field], config["data_type"])}
                        </div>
                    ))}
                    <Button className="m-2" variant="secondary" onClick={onCancel}>Back</Button>
                </>
            )}
        </div>
    );
};


export default Item;


function selectXOR(data, option) {

}
