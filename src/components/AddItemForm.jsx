import { sheetService, STATUS_OPTIONS } from '../services/sheetService';

const LOCATION_OPTIONS = [
  "ORD- Office of the Director",
  "FAD - Finance and Administrative Division",
  "LRD - Licensure and Registration Division",
  "Application Section",
  "Registration Section",
  "Regulation Division",
  "Legal Section",
  "Storage Room 2",
  "Robinsons Iligan",
  "Robinsons Valencia"
];

// ... in your form component ...
<div>
  <label htmlFor="status">Status</label>
  <input
    id="status"
    name="status"
    type="text"
    value={formData.status}
    onChange={handleChange}
    placeholder="Type SERVICEABLE or UNSERVICEABLE"
    required
  />
  <small>Please type either SERVICEABLE or UNSERVICEABLE</small>
</div>

// In your handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // This will throw an error if status is invalid
    sheetService.validateStatus(formData.status);
    
    // Continue with form submission
    await sheetService.addItem(formData);
    // ... rest of your submit logic
  } catch (error) {
    // Handle the error (show error message to user)
    setError(error.message);
  }
}; 