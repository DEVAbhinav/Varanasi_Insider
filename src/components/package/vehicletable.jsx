// VehicleTable.js

import React, { useState, useEffect } from 'react';
import VindhyachalData from './data/VindhyachalVehicle.json';
import PrayagrajData from "./data/PrayagrajVehicle.json"
import GayaData from "./data/Gaya.json" // Import data for Vindhyachal route
 // Import data for another route

const VehicleTable = ({ match }) => {
  const route = match.params.name
  const [data, setData] = useState([]);
  const [showFullTable, setShowFullTable] = useState(false);
  useEffect(() => {
    // Fetch data based on the route name
    
    let routeData = [];
    if (route=== 'Vindhyachal') {
      routeData = VindhyachalData;}
    if (route=== 'Prayagraj') {
        routeData = PrayagrajData;}
    if (route=== 'Gaya') {
        routeData = GayaData;}
    setData(routeData);
  }, [route]);

  
  const displayedData = showFullTable ? data : data.slice(0, 4);
  return (
    <div id='vehicle-table'>
      <h2> {route} Package </h2>
      <table >
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>People</th>
            <th>Luggage</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody className={showFullTable ? 'expanded' : ''}>
          {displayedData.map((item, index) => (
            <tr key={index}>
              <td>{item.vehicle}</td>
              <td>{item.people}</td>
              <td>{item.luggage}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Render dropdown only if there are more than four rows */}
      {data.length > 4 && (
        <div>
          <button  id="button-show"onClick={() => setShowFullTable(!showFullTable)}>
            {showFullTable ? 'Show less' : 'Show more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default VehicleTable;
