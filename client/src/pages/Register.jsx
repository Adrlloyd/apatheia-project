import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login-Register.css';
import Modal from '../components/Modal';
import { registerUser } from '../services/registerService';
import { storeUserSession } from '../utils/storageUtils';
import { validateNewPassword } from '../utils/validationUtils';
import { setupAutoLogout } from '../utils/autoLogout';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateNewPassword(formData.password);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const result = await registerUser(formData);
      storeUserSession({ ...result, firstVisit: true });
      setupAutoLogout(result.token, () => navigate('/'));
      setShowSuccessModal(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleContinue = () => {
    setShowSuccessModal(false);
    navigate('/home');
  };

  return (
    <div className="page-wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>

      {showSuccessModal && (
        <Modal
          message="Registration successful."
          confirmText="Continue"
          onConfirm={handleContinue}
        />
      )}
    </div>
  );
}

export default Register;
