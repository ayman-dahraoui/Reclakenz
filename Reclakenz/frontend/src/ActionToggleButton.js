import React from 'react';

const ActionToggleButton = ({ 
  onApprove, 
  onReject, 
  approveText = "Approuver", 
  rejectText = "Rejeter",
  size = "normal", // "small", "normal", "modal"
  disabled = false 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "action-toggle-sm";
      case "modal":
        return "action-toggle-modal";
      default:
        return "action-toggle";
    }
  };

  return (
    <div className={getSizeClass()}>
      <button
        className="approve-section"
        onClick={onApprove}
        disabled={disabled}
        title={approveText}
      >
        <i className="fas fa-check"></i>
        {approveText}
      </button>
      <button
        className="reject-section"
        onClick={onReject}
        disabled={disabled}
        title={rejectText}
      >
        <i className="fas fa-times"></i>
        {rejectText}
      </button>
    </div>
  );
};

export default ActionToggleButton; 