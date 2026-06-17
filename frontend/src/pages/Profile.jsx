import React, { useState } from 'react';
import axios from 'axios';

function Profile({ user, setUser, t, API_URL }) {
  const [username, setUsername] = useState(user.username);
  const [language, setLanguage] = useState(user.preferred_language);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, {
        username,
        preferred_language: language
      });
      setUser(response.data.user);
      localStorage.setItem('language', language);
      setMessage(t('profile_updated'));
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(t('update_error'));
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm(t('confirm_delete_account'))) {
      await axios.delete(`${API_URL}/auth/account`);
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="profile">
      <h1>{t('my_profile')}</h1>
      
      {message && <div className="message">{message}</div>}
      
      <div className="profile-card">
        <div className="profile-avatar">👤</div>
        
        {isEditing ? (
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label>{t('username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('email')}</label>
              <input type="email" value={user.email} disabled />
            </div>
            <div className="form-group">
              <label>{t('language')}</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="profile-actions">
              <button type="submit">{t('save')} 💾</button>
              <button type="button" onClick={() => setIsEditing(false)}>{t('cancel')} ❌</button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <p><strong>{t('username')}:</strong> {user.username}</p>
            <p><strong>{t('email')}:</strong> {user.email}</p>
            <p><strong>{t('verified')}:</strong> {user.is_verified ? '✅' : '❌'}</p>
            <p><strong>{t('total_decisions')}:</strong> {user.total_decisions}</p>
            <p><strong>{t('member_since')}:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            <button onClick={() => setIsEditing(true)} className="edit-btn">✏️ {t('edit_profile')}</button>
          </div>
        )}
        
        <div className="profile-danger">
          <button onClick={handleLogout} className="logout-btn">🚪 {t('logout')}</button>
          <button onClick={handleDeleteAccount} className="delete-account-btn">
            ⚠️ {t('delete_account')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
