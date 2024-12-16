import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Accordion, Table, Dropdown, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import Equipment from './equipment';

const SelectEquipment = ({ url }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state.formData;
  const [equipment, setEquipment] = useState([]);
  const [equipmentTypes, setEquipmentTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [selectAll, setSelectAll] = useState(true);

  useEffect(() => {
    axios.get(`${url}/equipment_type`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setEquipmentTypes(response.data);
          setSelectedTypes(response.data.map(type => type.fk_idequipment_type));
        } else {
          console.error('Expected array but got', response.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [url]);

  useEffect(() => {
    axios.get(`${url}/equipment/available`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setEquipment(response.data);
        } else {
          console.error('Expected array but got', response.data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [url]);

  // Load selected items from sessionStorage on initial load
  useEffect(() => {
    const storedSelectedEquipment = sessionStorage.getItem('selectedEquipmentIds');
    if (storedSelectedEquipment) {
      setSelectedEquipment(JSON.parse(storedSelectedEquipment));
    }
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedEquipment(prevSelected => {
      const updatedSelected = checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value);
      // Update session storage
      sessionStorage.setItem('selectedEquipmentIds', JSON.stringify(updatedSelected));
      return updatedSelected;
    });
  };

  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedTypes(prevSelectedTypes => checked ? [...prevSelectedTypes, value] : prevSelectedTypes.filter(type => type !== value));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(equipmentTypes.map(type => type.fk_idequipment_type));
    }
    setSelectAll(!selectAll);
  };

  const handleNext = () => {
    navigate('/select_services', { state: { formData, selectedEquipment } });
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const groupEquipmentByType = (equipment) => {
    if (!Array.isArray(equipment)) return {};
    return equipment.reduce((acc, eq) => {
      const type = eq.equipment_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(eq);
      return acc;
    }, {});
  };

  const groupedEquipment = groupEquipmentByType(equipment);

  return (
    <Container className="mt-5">
      <h2 className="mb-4" style={{ color: '#FF5733' }}>Select Equipment</h2>
      {/* <Card className="mb-4">
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  <FaFilter /> Filter by Equipment Type
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Form.Check
                    type="checkbox"
                    id="select-all"
                    label="Select All"
                    onChange={handleSelectAll}
                    checked={selectAll}
                  />
                  {equipmentTypes.map((type) => (
                    <Form.Check
                      key={type.fk_idequipment_type}
                      type="checkbox"
                      id={type.fk_idequipment_type}
                      label={type.name}
                      value={type.fk_idequipment_type}
                      onChange={handleFilterChange}
                      checked={selectedTypes.includes(type.fk_idequipment_type)}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          <Accordion defaultActiveKey="0">
            {equipmentTypes.map((type, idx) => (
              selectedTypes.includes(type.fk_idequipment_type) && (
                <Accordion.Item eventKey={idx.toString()} key={type.fk_idequipment_type}>
                  <Accordion.Header>{type.name}</Accordion.Header>
                  <Accordion.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Brand</th>
                          <th>Model</th>
                          <th>Add</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedEquipment[type.name] && groupedEquipment[type.name].map(equipment => (
                          <tr key={equipment.idequipment}>
                            <td>{equipment.idequipment}</td>
                            <td>{equipment.brand}</td>
                            <td>{equipment.model}</td>
                            <td>
                              <Form.Check
                                type="checkbox"
                                value={equipment.idequipment}
                                checked={selectedEquipment.includes(equipment.idequipment)}
                                onChange={handleCheckboxChange}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              )
            ))}
          </Accordion>
        </Card.Body>
      </Card> */}
      <Equipment url={url}/>
      <Row className="justify-content-center">
        <Col md={6} className="text-center">
          <Button variant="secondary" onClick={handleBack} style={{ backgroundColor: '#FF5733', borderColor: '#FF5733', marginRight: '10px', borderRadius: '30px' }}>Back</Button>
          <Button variant="primary" onClick={handleNext} style={{ backgroundColor: '#FF5733', borderColor: '#FF5733', borderRadius: '30px' }}>Next</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SelectEquipment;
