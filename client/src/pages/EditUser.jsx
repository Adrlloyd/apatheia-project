import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import '../styles/EditUser.css';
import { updateName, updateUsername, updatePassword, deleteUser } from '../services/userService';
import { getToken, updateStoredName, clearUserSession } from '../utils/storageUtils';
import { validateNewPassword } from '../utils/validationUtils';

function EditUser() {
  const navigate = useNavigate();
  const token = getToken();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus('');

    try {
      if (name) {
        await updateName(name, token);
        updateStoredName(name);
      }

      if (username) {
        const response = await updateUsername(username, token);
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || 'Username update failed');
        }
      }

      if (newPassword) {
        const errorMsg = validateNewPassword(newPassword, currentPassword);
        if (errorMsg) {
          setStatus(errorMsg);
          return;
        }

        const response = await updatePassword(currentPassword, newPassword, token);
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || 'Password update failed');
        }
      }

      setName('');
      setUsername('');
      setCurrentPassword('');
      setNewPassword('');
      setStatus('Changes saved successfully.');
    } catch (error) {
      console.error('Error saving changes:', error);
      setStatus(error.message || 'Failed to save changes.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteUser(token);
      if (response.ok) {
        clearUserSession();
        navigate('/');
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="edit-user-container">
        <h2>Edit User</h2>
        <form onSubmit={handleSave} className="edit-form">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Update name"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Update username"
          />
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
          />
          <div className="button-row">
            <button type="submit" className="save-button">Save</button>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="delete-account-button"
            >
              Delete
            </button>
          </div>
        </form>
        {status && <p className="status-message">{status}</p>}
      </div>

      {showModal && (
        <Modal
          message="Are you sure you want to delete your account? This cannot be undone."
          confirmText="Yes"
          cancelText="No"
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default EditUser;