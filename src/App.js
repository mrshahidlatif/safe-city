import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TopBar from "./components/TopBar"
import AQIDistributionPlot from "./components/AQIDistributionPlot";
import AQITimelinePlot from "./components/AQITimelinePlot";
import SearchBox from './components/SearchBox';

import yearlyData from './data/annual_data.json';
import dailyData from './data/daily_data.json';

import { useEffect, useState } from 'react';

export default function App() {
  const [selectedItem, setSelectedItem] = useState("Baldwin");
  const [selectedData, setSelectedData] = useState(null)
  const [selectedDailyData, setSelectedDailyData] = useState(null);

  const handleSearchItem = (item) => {
    setSelectedItem(item);
  }

  useEffect(() => {
    if(selectedItem){
      setSelectedData(yearlyData[selectedItem]);
      setSelectedDailyData(dailyData[selectedItem]['2010'])
    }
  }, [selectedItem])
  return (
    <>
      <TopBar />
      <Container>
        <Row> <br /> </Row>
        <Row>
          <SearchBox handleSearchItem={handleSearchItem}/>
        </Row>
        <Row><AQITimelinePlot data={selectedDailyData} county={selectedItem}/></Row>
        <Row>
          <Col><AQIDistributionPlot data={selectedData} county={selectedItem}/></Col>
        </Row>
      </Container>
    </>
  );
}