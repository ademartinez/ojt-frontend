import React, { useState } from 'react';
import HPPForm from '../HPPForm/HPPForm';
import HPPQForm from '../HPPQForm/HPPQForm';
import LenovoPForm from '../LenovoPForm/LenovoPForm';
import LenovoPQForm from '../LenovoPQForm/LenovoPQForm';

const templates = [
  "HP Parts Request",
  "HP Parts Quotation",
  "Lenovo Parts Request",
  "Lenovo Parts Quotation",
];

const HomeScreen = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');

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
       selectedTemplate === "Lenovo Parts Request" ? <LenovoPForm /> :
       selectedTemplate === "Lenovo Parts Quotation" ? <LenovoPQForm /> :
       null}
    </div>
  );
};

export default HomeScreen;
