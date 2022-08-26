import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import { Typeahead } from 'react-bootstrap-typeahead';
import InputGroup from 'react-bootstrap/InputGroup';

import 'react-bootstrap-typeahead/css/Typeahead.css';

import searchOptions from '../autocomplete_counties';

export default function (props) {
    const [selected, setSelected] = useState([props.county]);

    // TODO: clear name of selected county after searching!
    useEffect(() => {
        props.handleSearchItem(selected[0])
    }, [selected]);

    return (
        <>
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="btnGroupAddon">Explore your county</InputGroup.Text>
                <Typeahead
                    id="basic-example"
                    onChange={setSelected}
                    options={searchOptions}
                    placeholder="Select a county"
                    selected={selected}
                />
            </InputGroup>
        </div>
        </>
    );
}