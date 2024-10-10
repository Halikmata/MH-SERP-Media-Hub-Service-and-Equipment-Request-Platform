import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Accordion, Table, Dropdown, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';

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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedEquipment(prevSelected => checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value));
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
      <Card className="mb-4">
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
                        {groupedEquipment[type.fk_idequipment_type]?.map(item => (
                          <tr key={item.idequipment}>
                            <td>{item.idequipment}</td>
                            <td>{item.brand}</td>
                            <td>{item.model}</td>
                            <td>
                              <Form.Check
                                type="checkbox"
                                id={item.idequipment}
                                value={item.idequipment}
                                onChange={handleCheckboxChange}
                                checked={selectedEquipment.includes(item.idequipment)}
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

          <div className="text-center">
            <Button variant="primary" onClick={handleNext} style={{ backgroundColor: '#FF5733', borderColor: '#FF5733', borderRadius: '30px' }}>Next</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SelectEquipment;