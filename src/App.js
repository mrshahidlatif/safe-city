import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TopBar from "./components/TopBar"
import AQIDistributionPlot from "./components/AQIDistributionPlot"
import SearchBox from './components/SearchBox';

import data from './annual_data.json';
import { useEffect, useState } from 'react';
import { select } from 'd3';

export default function App() {
  const [selectedItem, setSelectedItem] = useState("Baldwin");
  const [selectedData, setSelectedData] = useState(null)

  const handleSearchItem = (item) => {
    setSelectedItem(item);
  }

  useEffect(() => {
    if(selectedItem){
      setSelectedData(data[selectedItem]);
    }
  }, [selectedItem])

  return (
    <>
      <TopBar />
      <Container > 
        <Row>
          <SearchBox handleSearchItem={handleSearchItem}/>
        </Row>
        <Row>
          <Col><AQIDistributionPlot data={selectedData} county={selectedItem}/></Col>
        </Row>
      </Container>
    </>
  );
}