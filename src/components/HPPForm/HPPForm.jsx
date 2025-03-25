import React, { useState, useEffect } from 'react';
import styles from './HPPForm.module.css';

const Modal = ({ children }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {children}
      </div>
    </div>
  );
};

const HPPForm = () => {
  const [formData, setFormData] = useState({
    subjectParentRequestID: '',
    subjectPartRequest: '',
    recipients: ['support@nexustech.com.ph', 'tataa@nexustech.com.ph', 'pcnebrija@nexustech.com.ph'],
    ccs: ['trs-infra@nexustech.com.ph', 'svc@nexustech.com.ph'],
    images: [],
    company: '',
    contact: '',
    partRequest: '',
    attendingEngineer: '',
    model: '',
    productNo: '',
    serialNo: '',
    issueDescription: '',
    hasUnitBeenRepaired: 'No',
    repairHistory: '',
    troubleshootingPerformed: '',
    defectivePartCTCode: [''],
    defectivePartCTCodeImage: [],
    UEFIDiag: 'No',
    UEFIFailureID: '',
    exceptionCodes: '',
    windowsUpdate: 'No',
    firmwareUpdate: 'No',
    biosUpdate: 'No',
    reimaging: 'No',
    windowsOSImage: 'No',
    minConfigReset: 'No',
    WISEAdvisory: 'No',
    nonHP: 'No',
    suggestedRec: '',
    CSDPAttachment: 'No',
    emailCoordinator: '',
    emailAssignedEngineer: '@nexustech.com.ph',
    carbonBody: 'PH PPS CS PARTNER MGMT',
    carbonEmail: 'phppscss_partnermgmt@hp.com'
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [defectivePartCTCodeImagePreviews, setDefectivePartCTCodeImagePreviews] = useState([]); // New state for image previews

  const [engineers, setEngineers] = useState([]);
  const [isEditingEngineers, setIsEditingEngineers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status

  // Fetch engineers from the backend
  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await fetch('https://ojt-backend.onrender.com/api/engineers');
        //const response = await fetch('http://127.0.0.1:5000/api/engineers'); //change to your backend server
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
      await fetch('https://ojt-backend.onrender.com/api/engineers', {
      //await fetch('http://127.0.0.1:5000/api/engineers', { //change to your backend server
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
    if (field === 'subjectParentRequestID' || field === 'subjectPartRequest' || field === 'company' || field === 'contact' || field === 'partRequest' || field === 'attendingEngineer' || field === 'model' || field === 'productNo' || field === 'serialNo' || field === 'issueDescription' || field === 'hasUnitBeenRepaired' || field === 'repairHistory' || field === 'troubleshootingPerformed' || field === 'UEFIDiag' || field === 'UEFIFailureID' || field === 'exceptionCodes' || field === 'windowsUpdate' || field === 'firmwareUpdate' || field === 'biosUpdate' || field === 'reimaging' || field === 'windowsOSImage' || field === 'minConfigReset' || field === 'WISEAdvisory' || field === 'nonHP' || field === 'suggestedRec' || field === 'CSDPAttachment' || field === 'emailCoordinator' || field === 'emailAssignedEngineer' || field === 'carbonBody' || field === 'carbonEmail') {
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

  const handleDefectivePartCTCodeImageChange = (e, index) => {
    const file = e.target.files[0];
    const updatedImages = [...formData.defectivePartCTCodeImage];
    updatedImages[index] = file;
    setFormData({ ...formData, defectivePartCTCodeImage: updatedImages });
  
    const updatedPreviews = [...defectivePartCTCodeImagePreviews];
    updatedPreviews[index] = file ? URL.createObjectURL(file) : null;
    setDefectivePartCTCodeImagePreviews(updatedPreviews);
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

  const handleAddDefectivePartCTCode = () => {
    setFormData({
      ...formData,
      defectivePartCTCode: [...formData.defectivePartCTCode, ''], // Add a new empty text input
      defectivePartCTCodeImage: [...formData.defectivePartCTCodeImage, null], // Add a new empty image input
    });
    setDefectivePartCTCodeImagePreviews([...defectivePartCTCodeImagePreviews, null]); // Add a new preview placeholder
  };

  const handleRemoveDefectivePartCTCode = (index) => {
    const updatedCodes = formData.defectivePartCTCode.filter((_, i) => i !== index);
    const updatedImages = formData.defectivePartCTCodeImage.filter((_, i) => i !== index);
    const updatedPreviews = defectivePartCTCodeImagePreviews.filter((_, i) => i !== index);
  
    setFormData({
      ...formData,
      defectivePartCTCode: updatedCodes,
      defectivePartCTCodeImage: updatedImages,
    });
    setDefectivePartCTCodeImagePreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show confirmation dialog before sending the email
    const userChoice = window.confirm(
      "Your part request will be sent. Do you want to reset all your inputs after sending?"
    );

    setIsSubmitting(true); // Disable the button by setting isSubmitting to true

    const subject = `Parent Request ID: ${formData.subjectParentRequestID} Part Request: ${formData.subjectPartRequest}`;
    
    const formDataToSend = new FormData();
    formDataToSend.append('subject', subject);
    formDataToSend.append('company', formData.company);
    formDataToSend.append('contact', formData.contact);
    formDataToSend.append('partRequest', formData.partRequest);
    formDataToSend.append('attendingEngineer', formData.attendingEngineer);
    formDataToSend.append('model', formData.model);
    formDataToSend.append('productNo', formData.productNo);
    formDataToSend.append('serialNo', formData.serialNo);
    formDataToSend.append('issueDescription', formData.issueDescription);
    formDataToSend.append('hasUnitBeenRepaired', formData.hasUnitBeenRepaired);
    formDataToSend.append('repairHistory', formData.repairHistory);
    formDataToSend.append('troubleshootingPerformed', formData.troubleshootingPerformed);
    formDataToSend.append('UEFIDiag', formData.UEFIDiag);
    formDataToSend.append('UEFIFailureID', formData.UEFIFailureID);
    formDataToSend.append('exceptionCodes', formData.exceptionCodes);
    formDataToSend.append('windowsUpdate', formData.windowsUpdate);
    formDataToSend.append('firmwareUpdate', formData.firmwareUpdate);
    formDataToSend.append('biosUpdate', formData.biosUpdate);
    formDataToSend.append('reimaging', formData.reimaging);
    formDataToSend.append('windowsOSImage', formData.windowsOSImage);
    formDataToSend.append('minConfigReset', formData.minConfigReset);
    formDataToSend.append('WISEAdvisory', formData.WISEAdvisory);
    formDataToSend.append('nonHP', formData.nonHP);
    formDataToSend.append('suggestedRec', formData.suggestedRec);
    formDataToSend.append('CSDPAttachment', formData.CSDPAttachment);
    formDataToSend.append('emailCoordinator', formData.emailCoordinator);
    formDataToSend.append('emailAssignedEngineer', formData.emailAssignedEngineer);
    formDataToSend.append('carbonBody', formData.carbonBody);
    formDataToSend.append('carbonEmail', formData.carbonEmail);
    formData.recipients.forEach((recipient, index) => {
      formDataToSend.append(`recipient${index + 1}`, recipient);
    });
    formData.ccs.forEach((cc, index) => {
      formDataToSend.append(`cc${index + 1}`, cc);
    });
    formData.images.forEach((image, index) => {
      formDataToSend.append(`image${index}`, image);
    });
    formData.defectivePartCTCode.forEach((code, index) => {
      formDataToSend.append(`defectivePartCTCode${index + 1}`, code);
    });
    formData.defectivePartCTCodeImage.forEach((image, index) => {
      if (image) {
        formDataToSend.append(`defectivePartCTCodeImage${index}`, image);
      }
    });

    try {
      const response = await fetch('https://ojt-backend.onrender.com/send-email', {
      //const response = await fetch('http://127.0.0.1:5000/send-email', { //change to your backend server
        method: 'POST',
        body: formDataToSend
      });
      const data = await response.json();
      if (response.ok) {
        alert('Email sent successfully!');

        if (userChoice) {
          // Reload the page if the user chooses "Yes"
          window.location.reload();
        } else {
          // Retain all inputs except recipients and ccs
          setFormData({
            ...formData,
            recipients: [''],
            ccs: [''],
          });
        }

      } else {
        alert(`Failed to send email: ${data.message}`);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission is complete
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.hppForm}>
      <h2 className={styles.title}>HP Parts Request Email Form</h2>
      
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
        <label>Part Request:</label>
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
        <label>Has the unit been repaired for this issue before:</label>
        <select
          name="hasUnitBeenRepaired"
          value={formData.hasUnitBeenRepaired}
          onChange={(e) => handleChange(e, null, 'hasUnitBeenRepaired')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      {formData.hasUnitBeenRepaired === 'Yes' && (
        <div>
          <label>If yes, please provide repair history (Must be in Bulleted List per Date):</label>
          <textarea
            name="repairHistory"
            value={formData.repairHistory}
            onChange={(e) => handleChange(e, null, 'repairHistory')}
          />
        </div>
      )}
      <div>
        <label>Detailed troubleshooting performed (list in points):</label>
        <textarea
          name="troubleshootingPerformed"
          value={formData.troubleshootingPerformed}
          onChange={(e) => handleChange(e, null, 'troubleshootingPerformed')}
        />
      </div>

      <label>Defective Part CT Code:</label>
      {formData.defectivePartCTCode.map((code, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Text Input */}
          <input
            type="text"
            placeholder={`Defective Part CT Code ${index + 1}`}
            value={code}
            onChange={(e) => handleChange(e, index, 'defectivePartCTCode')}
          />

          {/* Image Upload */}
          <input
            type="file"
            onChange={(e) => handleDefectivePartCTCodeImageChange(e, index)}
          />

          {/* Image Preview */}
          {defectivePartCTCodeImagePreviews[index] && (
            <div>
              <img
                src={defectivePartCTCodeImagePreviews[index]}
                alt={`Defective Part CT Code ${index + 1}`}
                style={{ marginTop: '10px', maxWidth: '400px', maxHeight: '400px' }}
              />
            </div>
          )}

          {/* Remove Button */}
          <button type="button" onClick={() => handleRemoveDefectivePartCTCode(index)}>-</button>
        </div>
      ))}

      <button type="button" onClick={handleAddDefectivePartCTCode}>+</button>
      
      <div>
        <label>UEFI Diagnostics Performed:</label>
        <select
          name="UEFIDiag"
          value={formData.UEFIDiag}
          onChange={(e) => handleChange(e, null, 'UEFIDiag')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label>If yes, please provide the UEFI Failure ID:</label>
        <input
          type="text"
          name="UEFIFailureID"
          value={formData.UEFIFailureID}
          onChange={(e) => handleChange(e, null, 'UEFIFailureID')}
        />
      </div>

      <div>
        <label>If no, (Please share the reason - T/C the use of exception codes):</label>
        <input
          type="text"
          name="exceptionCodes"
          value={formData.exceptionCodes}
          onChange={(e) => handleChange(e, null, 'exceptionCodes')}
        />
      </div>

      <div>
        <label>Performed Windows Update: </label>
        <select
          name="windowsUpdate"
          value={formData.windowsUpdate}
          onChange={(e) => handleChange(e, null, 'windowsUpdate')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>      

      <div>
        <label>Performed Firmware/Drivers update: </label>
        <select
          name="firmwareUpdate"
          value={formData.firmwareUpdate}
          onChange={(e) => handleChange(e, null, 'firmwareUpdate')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div> 

      <div>
        <label>Performed Bios Update / Crisis Recovery: </label>
        <select
          name="biosUpdate"
          value={formData.biosUpdate}
          onChange={(e) => handleChange(e, null, 'biosUpdate')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label>Performed Reimaging/Reformat/Reinstallation of OS: </label>
        <select
          name="reimaging"
          value={formData.reimaging}
          onChange={(e) => handleChange(e, null, 'reimaging')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label>Windows OS Image: </label>
        <select
          name="windowsOSImage"
          value={formData.windowsOSImage}
          onChange={(e) => handleChange(e, null, 'windowsOSImage')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label>Performed Minimum config / Hard reset: </label>
        <select
          name="minConfigReset"
          value={formData.minConfigReset}
          onChange={(e) => handleChange(e, null, 'minConfigReset')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label>Is there any WISE Advisory: </label>
        <select
          name="WISEAdvisory"
          value={formData.WISEAdvisory}
          onChange={(e) => handleChange(e, null, 'WISEAdvisory')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label>Is there any 3rd Party/Non-HP Part Involved: </label>
        <select
          name="nonHP"
          value={formData.nonHP}
          onChange={(e) => handleChange(e, null, 'nonHP')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label>Suggested Recommendation: </label>
        <input
          type="text"
          name="suggestedRec"
          value={formData.suggestedRec}
          onChange={(e) => handleChange(e, null, 'suggestedRec')}
          required
        />
      </div>

      <div>
        <label>With CSDP attachment: </label>
        <select
          name="CSDPAttachment"
          value={formData.CSDPAttachment}
          onChange={(e) => handleChange(e, null, 'CSDPAttachment')}
          required
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

      <div>
        <label>Email Address Coordinator (Handling CSDP): </label>
        <input
          type="text"
          name="emailCoordinator"
          value={formData.emailCoordinator}
          onChange={(e) => handleChange(e, null, 'emailCoordinator')}
        />
      </div>

      <div>
        <label>Email Address of Assigned Engineer: </label>
        <input
          type="text"
          name="emailAssignedEngineer"
          value={formData.emailAssignedEngineer}
          onChange={(e) => handleChange(e, null, 'emailAssignedEngineer')}
          required
        />
      </div>

      <div>
        <label>CC: </label>
        <input
          type="text"
          name="carbonBody"
          value={formData.carbonBody}
          onChange={(e) => handleChange(e, null, 'carbonBody')}
          required
        />
        <input
          type="text"
          name="carbonEmail"
          value={formData.carbonEmail}
          onChange={(e) => handleChange(e, null, 'carbonEmail')}
          required
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

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting} // Disable the button when isSubmitting is true
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>    

    </form>
  );
};

export default HPPForm;