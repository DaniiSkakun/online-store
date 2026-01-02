import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Button, Form} from "react-bootstrap";
import {createCity} from "../../http/propertyAPI";

const CreateCity = ({show, onHide}) => {
    const [name, setName] = useState('');

    const addCity = async () => {
        if (!name.trim()) {
            alert('Введіть назву міста');
            return;
        }
        await createCity({name: name.trim()});
        setName('');
        onHide();
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton closeVariant="dark">
                <Modal.Title id="contained-modal-title-vcenter">
                    Додати місто
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Назва міста"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>Закрити</Button>
                <Button variant="success" onClick={addCity}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCity;
