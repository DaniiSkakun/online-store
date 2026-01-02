import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import PropertyItem from "./PropertyItem";

const PropertyList = observer(() => {
    const {property} = useContext(Context)

    if (property.properties.length === 0) {
        return (
            <div className="text-center mt-5 text-muted">
                <h5>🏠 Нерухомість поки відсутня</h5>
            </div>
        )
    }

    return (
        <Row className="d-flex">
            {property.properties.map(property =>
                <PropertyItem key={property.id} property={property}/>
            )}
        </Row>
    );
});

export default PropertyList;


