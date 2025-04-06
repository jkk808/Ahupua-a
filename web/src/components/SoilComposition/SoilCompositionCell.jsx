import React from "react";
import Papa from 'papaparse';
import soilData from "../../../../hackathon_soil_data.json"

const siteNameMap = {
  "Nation of Hawaii stream edge": "top-bed", // temporary
  "Nation of Hawaii middle loʻi": "mid-bed",
  "Nation of Hawaii lower loʻi": "bot-bed",
};

const fieldLabels = {
  date_sampled: "Date Sampled",
  TEC: "TEC",
  ph: "pH",
  sulfur: "Sulfur",
  phosphorus: "Phosphorus",
  olsen_p: "Olsen P",
  calcium: "Calcium",
  magnesium: "Magnesium",
  potassium: "Potassium",
  sodium: "Sodium",
  boron: "Boron",
  iron: "Iron",
  manganese: "Manganese",
  copper: "Copper",
  zinc: "Zinc",
  aluminum: "Aluminum",
  total_carbon_pct: "Total Carbon PCT",
};

const SoilCompositionCell = ({location}) => {
  const filteredSoilData = soilData.filter(
    (item) => siteNameMap[item.site_name] === location
  )

  console.log(filteredSoilData)

  const mostRecentSample = filteredSoilData.reduce((latest, current) =>
    new Date(current.date_sampled) > new Date(latest.date_sampled) ? current : latest,
    filteredSoilData[0]
  )

  return (
    <div style={{ display: 'flex' }}>
    <div className="rw-segment rw-table-wrapper-responsive" style={{ width: '45%' }}>
      <table className="rw-table">
        <thead>
          <tr>
            <th style={{ width: '35% '}}>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fieldLabels).map(([field, label]) => {
            let value = '-';

            if (mostRecentSample && mostRecentSample[field] !== undefined) {
              value = mostRecentSample[field];
            }

            return (
              <tr key={field}>
                <td>{label}</td>
                <td>{value}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default SoilCompositionCell