import React, { useState, useEffect } from 'react';
import styles from './HPPQForm.module.css'; // Importing the CSS module

const Modal = ({ children }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {children}
      </div>
    </div>
  );
};

const HPPQForm = () => {
  const [formData, setFormData] = useState({
    recipients: ['spareparts@nexustech.com.ph'],
    ccs: ['svc@nexustech.com.ph', 'trs-infra@nexustech.com.ph'],
    subjectParentRequestID: '',
    subjectPartRequest: '',
    company: '',
    contact: '',
    partRequest: '',
    sparePartNum: '',
    tableData: [['', '', '', '']], // Initialize with one empty row
    CTCodeNum: '',  
    attendingEngineer: '',
    model: '',
    productNo: '',
    serialNo: '',
    issueDescription: '',
    troubleshootingPerformed: '',
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const [engineers, setEngineers] = useState([]);
  const [isEditingEngineers, setIsEditingEngineers] = useState(false);

  // Fetch engineers from the backend
  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/engineers'); //change to your backend server
        const data = await response.json();
        setEngineers(data);
      } catch (error) {
        console.error('Failed to fetch engineers:', error);
      }
    };
    fetchEngineers();
  }, []);

  const handleAddEngineer = () => {
    setEngineers([...engineers, '']);
  };

  const handleRemoveEngineer = (index) => {
    const updatedEngineers = engineers.filter((_, i) => i !== index);
    setEngineers(updatedEngineers);
  };

  const handleEngineerChange = (e, index) => {
    const newEngineers = [...engineers];
    newEngineers[index] = e.target.value;
    setEngineers(newEngineers);
  };

  const saveEngineers = async () => {
    try {
      await fetch('http://127.0.0.1:5000/api/engineers', { //change to your backend server
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engineers }),
      });
      setIsEditingEngineers(false);
    } catch (error) {
      console.error('Failed to save engineers:', error);
    }
  }; 

  const handleChange = (e, index, field) => {
    const { value } = e.target;
    if (field === 'subjectParentRequestID' || field === 'subjectPartRequest' || field === 'company' || field === 'contact' || field === 'partRequest' || field === 'sparePartNum' || field === 'CTCodeNum' || field === 'attendingEngineer' || field === 'model' || field === 'productNo' || field === 'serialNo' || field === 'issueDescription' || field === 'troubleshootingPerformed' ) {
      setFormData({ ...formData, [field]: value });
    } else {
      const newFieldValues = [...formData[field]];
      newFieldValues[index] = value;
      setFormData({ ...formData, [field]: newFieldValues });
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData({ ...formData, images: newImages });

    const newImagePreviews = [...imagePreviews];
    newImagePreviews[index] = URL.createObjectURL(file);
    setImagePreviews(newImagePreviews);
  };


  const handleAddField = (field) => {
    const newFieldValues = [...formData[field], ''];
    setFormData({ ...formData, [field]: newFieldValues });
  };

  const handleRemoveField = (index, field) => {
    const newFieldValues = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newFieldValues });
  };

  const handleAddImage = () => {
    setFormData({ ...formData, images: [...formData.images, null] });
    setImagePreviews([...imagePreviews, null]);
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });

    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newImagePreviews);
  };

  const handleTableChange = (e, rowIndex, cellIndex) => {
    const newTableData = [...formData.tableData];
    newTableData[rowIndex][cellIndex] = e.target.value;
    setFormData({ ...formData, tableData: newTableData });
  };
  
  const handleAddTableRow = () => {
    const newTableData = [...formData.tableData, ['', '', '', '']]; // Add a new empty row
    setFormData({ ...formData, tableData: newTableData });
  };
  
  const handleRemoveTableRow = (rowIndex) => {
    const newTableData = formData.tableData.filter((_, index) => index !== rowIndex); // Remove the selected row
    setFormData({ ...formData, tableData: newTableData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const subject = `Subject: Parent Request ID: ${formData.subjectParentRequestID} Part Request: ${formData.subjectPartRequest}`;
    
    const formDataToSend = new FormData();
    formDataToSend.append('subject', subject);
    formDataToSend.append('company', formData.company);
    formDataToSend.append('contact', formData.contact);
    formDataToSend.append('partRequest', formData.partRequest);
    formDataToSend.append('sparePartNum', formData.sparePartNum);
    formDataToSend.append('CTCodeNum', formData.CTCodeNum);
    formDataToSend.append('attendingEngineer', formData.attendingEngineer);
    formDataToSend.append('model', formData.model);
    formDataToSend.append('productNo', formData.productNo);
    formDataToSend.append('serialNo', formData.serialNo);
    formDataToSend.append('issueDescription', formData.issueDescription);
    formDataToSend.append('troubleshootingPerformed', formData.troubleshootingPerformed);
    formData.recipients.forEach((recipient, index) => {
      formDataToSend.append(`recipient${index + 1}`, recipient);
    });
    formData.ccs.forEach((cc, index) => {
      formDataToSend.append(`cc${index + 1}`, cc);
    });
    formData.images.forEach((image, index) => {
      formDataToSend.append(`image${index}`, image);
    });
    formDataToSend.append('tableData', JSON.stringify(formData.tableData));

    try {
      const response = await fetch('http://127.0.0.1:5000/send-email-HPQ', {
        method: 'POST',
        body: formDataToSend
      });
      const data = await response.json();
      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert(`Failed to send email: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.hppForm}>
      <h2 className={styles.title}>HP Parts Quotation Email Form</h2>
      
      {formData.recipients.map((recipient, index) => (
        <div key={index} className={styles.flexRow}>
          <label>Recipient {index + 1}:</label>
          <input
            type="email"
            name={`recipient${index + 1}`}
            value={recipient}
            onChange={(e) => handleChange(e, index, 'recipients')}
            required
          />
          <button type="button" onClick={() => handleRemoveField(index, 'recipients')}>-</button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddField('recipients')}>+</button>

      {formData.ccs.map((cc, index) => (
        <div key={index} className={styles.flexRow}>
          <label>CC {index + 1}:</label>
          <input
            type="email"
            name={`cc${index + 1}`}
            value={cc}
            onChange={(e) => handleChange(e, index, 'ccs')}
          />
          <button type="button" onClick={() => handleRemoveField(index, 'ccs')}>-</button>
        </div>
      ))}
      <button type="button" onClick={() => handleAddField('ccs')}>+</button>

      <label>Subject</label>
      <div>
        <label>Parent Request ID:</label>
        <input
          type="text"
          name="subjectParentRequestID"
          value={formData.subjectParentRequestID}
          onChange={(e) => handleChange(e, null, 'subjectParentRequestID')}
          required
        />
      </div>
      <div>
        <label>Part Quotation:</label>
        <input
          type="text"
          name="subjectPartRequest"
          value={formData.subjectPartRequest}
          onChange={(e) => handleChange(e, null, 'subjectPartRequest')}
          required
        />
      </div>
      <label>Body</label>
      <div>
        <label>Company:</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={(e) => handleChange(e, null, 'company')}
          required
        />
      </div>
      <div>
        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={(e) => handleChange(e, null, 'contact')}
          required
        />
      </div>
      <div>
        <label>Part Request:</label>
        <textarea
          name="partRequest"
          value={formData.partRequest}
          onChange={(e) => handleChange(e, null, 'partRequest')}
          required
        />
      </div>

      <div>
        <label>Spare Part No. (SPN):</label>
        <input
          type="text"
          name="sparePartNum"
          value={formData.sparePartNum}
          onChange={(e) => handleChange(e, null, 'sparePartNum')}
          required
        />
      </div>

      <label>Spare Part Number Table:</label>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
            <th>Column 4</th>
            <th>Actions</th> {/* Add a column for the minus button */}
          </tr>
        </thead>
        <tbody>
          {formData.tableData && formData.tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => handleTableChange(e, rowIndex, cellIndex)}
                  />
                </td>
              ))}
              <td>
                <button
                  type="button"
                  onClick={() => handleRemoveTableRow(rowIndex)}
                  className={styles.removeRowBtn}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={handleAddTableRow}>Add Row</button>

      <div>
        <label>CT Code:</label>
        <input
          type="text"
          name="CTCodeNum"
          value={formData.CTCodeNum}
          onChange={(e) => handleChange(e, null, 'CTCodeNum')}
          required
        />
      </div>

      <div>
        <label>Attending Engineer:</label>
        <select
          name="attendingEngineer"
          value={formData.attendingEngineer}
          onChange={(e) => setFormData({ ...formData, attendingEngineer: e.target.value })}
          required
        >
          <option value="">Select Engineer</option>
          {engineers.map((name, index) => (
            <option key={index} value={name}>{name}</option>
          ))}
        </select>
        <button type="button" onClick={() => setIsEditingEngineers(true)}>Edit</button>
      </div>

      {isEditingEngineers && (
        <Modal>
          <h3>Edit Engineers</h3>
          {engineers.map((engineer, index) => (
            <div key={index} className={styles.flexRow}>
              <input
                type="text"
                value={engineer}
                onChange={(e) => handleEngineerChange(e, index)}
              />
              <button type="button" onClick={() => handleRemoveEngineer(index)}>-</button>
            </div>
          ))}
          <button type="button" onClick={handleAddEngineer}>+</button>
          <button type="button" onClick={saveEngineers}>Save</button>
        </Modal>
      )}

      <div>
        <label>Model:</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={(e) => handleChange(e, null, 'model')}
          required
        />
      </div>
      <div>
        <label>Product No:</label>
        <input
          type="text"
          name="productNo"
          value={formData.productNo}
          onChange={(e) => handleChange(e, null, 'productNo')}
          required
        />
      </div>
      <div>
        <label>Serial No:</label>
        <input
          type="text"
          name="serialNo"
          value={formData.serialNo}
          onChange={(e) => handleChange(e, null, 'serialNo')}
          required
        />
      </div>
      <div>
        <label>Issue Description:</label>
        <textarea
          name="issueDescription"
          value={formData.issueDescription}
          onChange={(e) => handleChange(e, null, 'issueDescription')}
          required
        />
      </div>

      <div>
        <label>Detailed troubleshooting performed (list in points):</label>
        <textarea
          name="troubleshootingPerformed"
          value={formData.troubleshootingPerformed}
          onChange={(e) => handleChange(e, null, 'troubleshootingPerformed')}
        />
      </div>
      <label>Picture/Images(s): </label>
      {formData.images.map((_, index) => (
        <div key={index}>
          <label>Upload Image {index + 1}:</label>
          <input type="file" onChange={(e) => handleFileChange(e, index)} required />
          <button type="button" onClick={() => handleRemoveImage(index)}>-</button>
          {imagePreviews[index] && (
            <div>
              <img src={imagePreviews[index]} alt="Preview" style={{ marginTop: '10px', maxWidth: '400px', maxHeight: '400px' }} />
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={handleAddImage}>+</button>

      <button type="submit" className={styles.submitBtn}>Submit</button>
    </form>
  );
};

export default HPPQForm;