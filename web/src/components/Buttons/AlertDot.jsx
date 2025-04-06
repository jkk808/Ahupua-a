import React from 'react';
import '../../styles.css'; // Create a separate CSS file or use inline styles

function AlertDot({ hasAlert }) {
  return (
    <div className="alert-container">
      {/* Your element, e.g., a button or icon */}
      {hasAlert && <div className="alert-dot" />}
    </div>
  );
}

export default AlertDot;