import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const Pages = observer(() => {
    const {property} = useContext(Context)

    // Защита от undefined
    if (!property || !property.totalCount || !property.limit) {
        return null;
    }

    const pageCount = Math.ceil(property.totalCount / property.limit)
    const pages = []

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }

    return (
        <div className="mt-3 mb-5 d-flex justify-content-center">
            <div className="d-flex gap-3">
                {pages.map(page => (
                    <button
                        key={page}
                        className={`btn mx-2 ${property.page === page ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => property.setPage(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
});

export default Pages;
