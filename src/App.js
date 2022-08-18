import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TopBar from "./components/TopBar"
import AQIDistributionPlot from "./components/AQIDistributionPlot";
import AQIDailyPlot from "./components/AQIDailyPlot";
import SearchBox from './components/SearchBox';
import YearlySummary from './components/YearlySummary';
import AQIComparisonPlot from './components/AQIComparisonPlot';

import yearlyData from './data/annual_data.json';

//TODO: Due to memory constraints daily data is only for 2019-2022
import dailyData from './data/daily_data.json';

import { useEffect, useState } from 'react';

export default function App() {
  const [selectedCounty, setSelectedCounty] = useState("Baldwin");
  const [countyData, setCountyData] = useState(null)
  const [selectedDailyData, setSelectedDailyData] = useState(null);
  //TODO: What if data is not available or 2022, e.g., Los Angeles
  const [selectedYear, setSelectedYear] = useState(2022);

  const handleSearchItem = (county) => {
    setSelectedCounty(county);
  }


  useEffect(() => {
    if(selectedCounty){
      setCountyData(yearlyData[selectedCounty]);
      setSelectedDailyData(dailyData[selectedCounty][selectedYear])
    }
  }, [selectedCounty, selectedYear]);

  const handleYearSelection = (year) => {
    if(selectedCounty)
      setSelectedYear(+year);
  };
 
  return (
    <>
      <TopBar />
      <Container>
        <Row> <br /> </Row>
        <Row>
          <SearchBox county={selectedCounty} handleSearchItem={handleSearchItem}/>
        </Row>
        <Row>
          <YearlySummary data={countyData} year={selectedYear}/>
        </Row>
        <Row>
          <AQIDailyPlot data={selectedDailyData} county={selectedCounty}/>
        </Row>
        <Row>
          <Col>
            <AQIDistributionPlot data={countyData} county={selectedCounty} handleYearSelection={handleYearSelection}/>
          </Col>
          <Col>
            <AQIComparisonPlot data={yearlyData} county={selectedCounty} year={selectedYear} />
          </Col>
        </Row>
      </Container>
    </>
  );
}