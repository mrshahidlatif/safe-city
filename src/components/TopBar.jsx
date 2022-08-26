import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function () {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <img
              alt=""
              src={process.env.PUBLIC_URL + '/air-quality.png'} 
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Safe City
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}