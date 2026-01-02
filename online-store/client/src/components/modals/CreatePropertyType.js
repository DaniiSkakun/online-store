import React, {useMemo, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Form, Button} from "react-bootstrap";
import {createPropertyType} from "../../http/propertyAPI";

const CreatePropertyType = ({show, onHide}) => {
    const [name, setName] = useState('')

    const slugify = (value = '') => {
        const map = {
            а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', є:'ie', ж:'zh', з:'z', и:'y', і:'i', ї:'i', й:'i',
            к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'h', ц:'ts', ч:'ch',
            ш:'sh', щ:'shch', ю:'yu', я:'ya', ы:'y', э:'e', ъ:'', ь:'', ґ:'g'
        };
        return value
            .toLowerCase()
            .replace(/[а-яёіїєґ]/g, ch => map[ch] ?? ch)
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 50);
    };

    const slug = useMemo(() => slugify(name), [name]);

    const addPropertyType = () => {
        createPropertyType({name, slug}).then(() => {
            setName('')
            onHide()
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton closeVariant="dark">
                <Modal.Title id="contained-modal-title-vcenter">
                    Додати тип нерухомості
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Назва типу (Квартири, Будинки, Ділянки)"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>Закрити</Button>
                <Button variant="success" onClick={addPropertyType}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreatePropertyType;








