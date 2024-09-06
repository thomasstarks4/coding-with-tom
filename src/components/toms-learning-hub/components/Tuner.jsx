import "../styles/Tuner.css";
import { useState } from "react";
import { toast } from 'react-toastify'; // Import toast

const Tuner = ({ startersSelected, setStartersSelected }) => {
  // Local state to manage changes
  const [localStarters, setLocalStarters] = useState(startersSelected);

  // Function to handle checkbox change
  const handleCheckboxChange = (key) => {
    setLocalStarters((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        isShown: !prevState[key].isShown,
      },
    }));
  };

  // Function to save changes to the parent state and show a toast notification
  const saveChanges = () => {
    setStartersSelected(localStarters); // Update parent state with local state
    toast.success('Tuner settings saved successfully!'); // Show success toast
  };

  return (
    <div className="tuner-wrapper">
      <h1 className="tuner-title">Tuner</h1>
      <h3 className="tuner-subtitle">Pick which sentence starters to use!</h3>
      <div className="tuner-container">
        {Object.keys(localStarters).map((key) => {
          const starter = localStarters[key];
          return (
            <div key={key} className="starter-item">
              {/* Checkbox for each starter */}
              <input
                type="checkbox"
                checked={starter.isShown}
                onChange={() => handleCheckboxChange(key)}
                className="starter-checkbox"
                id={`checkbox-${key}`}
              />
              {/* Display text next to the checkbox */}
              <label htmlFor={`checkbox-${key}`} className="starter-label">{starter.text}</label>
              {/* Display partner type */}
              <span className="partner-type">({starter.partnerType})</span>
            </div>
          );
        })}
        <button className="three-d-button" type="button" onClick={saveChanges}>
          Save Tuner Settings
        </button>
      </div>
    </div>
  );
};

export default Tuner;
