import React from "react";
import Card from "react";
import mockSoilComp from "../../../../mockSoilComposition.json"

const SoilComposition = () => {
  return (
    <div style={{ display: 'flex' }}>
    <div className="rw-segment rw-table-wrapper-responsive" style={{ width: '45%' }}>
      <table className="rw-table">
        <thead>
          <tr>
            <th style={{ width: '35% '}}>Name</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {mockSoilComp.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ padding: '30px', width: '45%' }}>
           Description of selected item from the left list
    </div>
    </div>
  )
}

export default SoilComposition