
const SensorPanel = ({ sensorData, onClose}) => {
  if (!sensorData) return null
  return (
    <div>
      <div className="fixed right-0 h-full w-1/2 bg-white shadow-lg border-l border-gray-200 p-6 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">{sensorData.name}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          X          
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Location</h3>
          <p className="text-gray-900">{sensorData.location}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Zone</h3>
          <p className="text-gray-900 capitalize">{sensorData.zone}</p>
        </div>
        {/* Display appropriate sensor data if it has that in its data */}
        {sensorData.metrics.soilType && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Soil Type</h3>
            <p className="text-gray-900">{sensorData.metrics.soilType}</p>
          </div>
        )}
        {sensorData.metrics.waterLevel !== undefined && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Water Level</h3>
            <p className="text-gray-900">{sensorData.metrics.waterLevel}%</p>
          </div>
        )}
        {sensorData.metrics.temperature !== undefined && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Temperature</h3>
            <p className="text-gray-900">{sensorData.metrics.temperature}°C</p>
          </div>
        )}
        {sensorData.metrics.soilPower !== undefined && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Soil Power</h3>
            <p className="text-gray-900">{sensorData.metrics.soilPower}%</p>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default SensorPanel
