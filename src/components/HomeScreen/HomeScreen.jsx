import React, { useState } from 'react';
import HPPForm from '../HPPForm/HPPForm';
import HPPQForm from '../HPPQForm/HPPQForm';
//import LenovoPForm from '../LenovoPForm/LenovoPForm';
//import LenovoPQForm from '../LenovoPQForm/LenovoPQForm';

const templates = [
  "HP Parts Request",
  "HP Parts Quotation",
 // "Lenovo Parts Request",
 // "Lenovo Parts Quotation",
];

const HomeScreen = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track if the user is authenticated
  const [password, setPassword] = useState(''); // State to store the entered password
  const correctPassword = 'deskside'; // Replace with your desired password

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  // Render the password prompt if the user is not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Enter Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={handleLogin} style={{ marginLeft: '10px' }}>
          Submit
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Parts Request Email Web App</h2>

      {/* Radio Buttons for Template Selection */}
      <div>
        {templates.map((template) => (
          <label key={template} style={{ marginRight: '10px' }}>
            <input
              type="radio"
              name="template"
              value={template}
              checked={selectedTemplate === template}
              onChange={() => setSelectedTemplate(template)}
            />
            {template}
          </label>
        ))}
      </div>

      <hr />

      {/* Conditionally Render the Selected Form Component */}
      {selectedTemplate === "HP Parts Request" ? <HPPForm /> :
       selectedTemplate === "HP Parts Quotation" ? <HPPQForm /> :
      // selectedTemplate === "Lenovo Parts Request" ? <LenovoPForm /> :
      // selectedTemplate === "Lenovo Parts Quotation" ? <LenovoPQForm /> :
       null}
    </div>
  );
};

export default HomeScreen;
