import React, { useState } from 'react';
import './CreateUser.scss';
import { API_BASE } from '../../constants';
import Success from '../../assets/success-image.svg';

export const CreateUser = ({ positions, token, addUser }) => {
  const [photoName, setPhotoName] = useState('Upload your photo');
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position_id: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [focusedFields, setFocusedFields] = useState({
    name: false,
    email: false,
    phone: false,
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (value.length < 2 || value.length > 60)
          return 'Username should contain 2-60 characters.';
        break;
      case 'email':
        if (value.length < 6 || value.length > 100) return 'Email should be 6-100 characters.';
        if (
          !/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+))$/.test(
            value
          )
        ) {
          return 'User email, must be a valid email according to RFC2822';
        }
        break;
      case 'phone':
        if (!/^[\+]{0,1}380([0-9]{9})$/.test(value))
          return 'User phone number. Number should start with code of Ukraine +380 and have 9 digits after it.';
        break;
      case 'position_id':
        if (!value || Number(value) < 1) return 'Position is required.';
        break;
      case 'photo':
        if (!value || !['image/jpeg', 'image/jpg'].includes(value.type))
          return 'Invalid photo format.';
        if (value.size > 5 * 1024 * 1024) return 'Photo must be <= 5MB';
        return new Promise(resolve => {
          const img = new Image();
          img.onload = () => {
            if (img.width < 70 || img.height < 70) {
              resolve('Minimum size of photo is 70x70px');
            } else {
              resolve('');
            }
          };
          img.src = URL.createObjectURL(value);
        });
      default:
        return '';
    }
    return '';
  };

  const handleFocus = field => {
    setFocusedFields(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = field => {
    if (!formData[field]) {
      setFocusedFields(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleChange = async e => {
    const { name, value, files } = e.target;
    let fieldValue = name === 'photo' ? files?.[0] : value;

    if (name === 'phone') {
      fieldValue = fieldValue.replace(/[^\d]/g, '');
      if (fieldValue && fieldValue[0] !== '+') {
        fieldValue = '+' + fieldValue;
      }
    }

    setFormData(prev => ({ ...prev, [name]: fieldValue }));

    if (name === 'photo' && files[0]) {
      setPhotoName(files[0].name);
      setIsLoadingPhoto(true);
      const errorMsg = await validateField(name, files[0]);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (errorMsg) {
          newErrors[name] = errorMsg;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
      setIsLoadingPhoto(false);
    } else {
      const errorMsg = validateField(name, fieldValue || '');
      setErrors(prev => {
        const newErrors = { ...prev };
        if (errorMsg) {
          newErrors[name] = errorMsg;
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const errs = {};

    for (const [k, v] of Object.entries(formData)) {
      const error = await validateField(k, v);
      if (error) errs[k] = error;
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const body = new FormData();
    Object.entries(formData).forEach(([k, v]) => body.append(k, v));

    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { Token: token },
      body,
    });

    const result = await res.json();

    if (result.success) {
      const userRes = await fetch(`${API_BASE}/users/${result.user_id}`);
      const userData = await userRes.json();

      addUser(userData.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);

      // очищуємо форму
      setFormData({ name: '', email: '', phone: '', position_id: '', photo: null });
      setPhotoName('Upload your photo');
      setErrors({});
    } else {
      setErrors(result.fails || { general: result.message });
    }
  };

  const isFormInvalid =
    !formData.name ||
    !formData.email ||
    !formData.phone ||
    !formData.position_id ||
    !formData.photo ||
    Object.values(errors).some(err => err) ||
    isLoadingPhoto;

  return (
    <section id="sign-up" className="create-user">
      <div className="create-user__container">
        {success && (
          <div className="create-user__success">
            <div className="create-user__success__message">
              <h1>User successfully registered</h1>
              <img src={Success} alt="Success" className="create-user__success__img" />
            </div>
          </div>
        )}
        <h1>Working with POST request</h1>
        <form onSubmit={handleSubmit} className="create-user__form">
          {['name', 'email', 'phone'].map(field => (
            <div key={field} className="create-user__input-container">
              <input
                className={`create-user__input ${errors[field] ? 'create-user__input__error' : ''}`}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                name={field}
                required
                autoComplete="off"
                value={formData[field]}
                onChange={handleChange}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
                maxLength={field === 'phone' ? '19' : undefined}
              />
              <span
                className={`create-user__floating-label ${
                  focusedFields[field] || formData[field]
                    ? 'create-user__floating-label--active'
                    : ''
                }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </span>
              {(errors[field] || !formData[field]) && (
                <p
                  className={
                    !focusedFields[field] && !formData[field]
                      ? 'create-user__example'
                      : 'create-user__error'
                  }
                >
                  {!focusedFields[field]
                    ? !formData[field]
                      ? field === 'name'
                        ? 'Example: Alice'
                        : field === 'email'
                        ? 'Example: alice.fonk@mail.com'
                        : field === 'phone'
                        ? 'Example: 380500740599'
                        : ''
                      : errors[field]
                    : errors[field]}
                </p>
              )}
            </div>
          ))}

          <div className="create-user__radio-container">
            <p className="create-user__select"> Select your position</p>
            {positions.map(pos => (
              <label key={pos.id} className="create-user__radio">
                <input
                  type="radio"
                  required
                  name="position_id"
                  value={pos.id}
                  checked={+formData.position_id === pos.id}
                  onChange={handleChange}
                />
                <p>{pos.name}</p>
              </label>
            ))}
            {errors.position_id && <p className="create-user__error">{errors.position_id}</p>}
          </div>

          <div className="create-user__file-upload">
            <label
              className={`create-user__file-label ${
                errors.photo ? 'create-user__input--error' : ''
              }`}
            >
              <span className="create-user__file-button">Upload</span>
              <span className="create-user__file-text">
                {formData.photo ? (
                  formData.photo.name
                ) : (
                  <p className="create-user__file-text-placeholder">{'Upload your photo'}</p>
                )}
              </span>

              <input
                className="create-user__file-input"
                required
                type="file"
                name="photo"
                accept="image/jpeg,image/jpg"
                onChange={handleChange}
              />
            </label>
            {isLoadingPhoto && <div className="loader">Loading...</div>}
          </div>
          {errors.photo && <p className="create-user__error">{errors.photo}</p>}

          <button type="submit" className="create-user__button" disabled={isFormInvalid}>
            Sign up
          </button>
          {errors.general && <div className="create-user__error">{errors.general}</div>}
        </form>
      </div>
    </section>
  );
};
