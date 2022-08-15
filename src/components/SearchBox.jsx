import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import { Typeahead } from 'react-bootstrap-typeahead';
import InputGroup from 'react-bootstrap/InputGroup';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import searchOptions from '../autocomplete_counties';

export default function (props) {
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        props.handleSearchItem(selected[0])
    }, [selected])

    return (
        <>
        <InputGroup className="mb-3">
            <Typeahead
                id="basic-example"
                onChange={setSelected}
                options={searchOptions}
                placeholder="Select a county"
                selected={selected}
            />
            <Button variant="outline-secondary" id="button-addon2">
            Search
            </Button>
        </InputGroup>
        </>
    );
}