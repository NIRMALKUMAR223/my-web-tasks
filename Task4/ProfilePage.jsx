import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({
    id: 1,
    name: '',
    email: '',
    phone: '',
    password: '',
    profilePic: ''
  });

  console.log(user);


  const [backupUser, setBackupUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // User profile loading
  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(res => {
        setUser(res.data[0]);
      })
      .catch(err => {
        console.error('Error loading profile:', err);
        alert('Failed to load profile—check console.');
      });
  }, []);

  // Input field change
  const handleChange = e => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  // Image change handler
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser(prev => ({ ...prev, profilePic: imageUrl }));
    }
  };

  const handleEdit = () => {
    setBackupUser({ ...user });
    setEditMode(true);
  };

  const handleSave = () => {
    if (!user.name || !user.email || !user.phone) {
      alert('Name, Email, and Phone are required.');
      return;
    }

    axios.put(`http://localhost:3000/users/${user.id}`, user)
      .then(() => {
        alert('Profile updated successfully');
        setEditMode(false);
      })
      .catch(err => {
        console.error('Update failed:', err);
        alert('Failed to update profile—check console.');
      });
  };

  const handleCancel = () => {
    if (backupUser) setUser({ ...backupUser });
    setEditMode(false);
  };

  return (
    <div className="profile-container">
      <div className="left">
        <img src={user.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="" className="avatar" />
        {editMode && (
          <input type="file" className='file' accept="image/*" onChange={handleImageChange} />
        )}
      </div>

      <div className="right">
        <h2>User Profile</h2>

        <label>Name:</label>
        <input name="name" value={user.name} onChange={handleChange} disabled={!editMode} />

        <label>Email:</label>
        <input name="email" value={user.email} onChange={handleChange} disabled={!editMode} />

        <label>Phone:</label>
        <input name="phone" value={user.phone} onChange={handleChange} disabled={!editMode} />

        <label>Password:</label>
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={user.password}
          onChange={handleChange}
          disabled={!editMode}
        />

        {editMode && (
          <div className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <p>Show Password</p>
          </div>
        )}

        <div className="buttons">
          {editMode ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button className="cancel" onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
