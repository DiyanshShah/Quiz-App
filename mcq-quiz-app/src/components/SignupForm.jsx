import { useState } from 'react';
import '../styles/Auth.css';

const SignupForm = ({ onSwitch, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formFields = [
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
    { name: 'securityQuestion', label: 'Security Question', type: 'text' },
    { name: 'securityAnswer', label: 'Security Answer', type: 'text' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateCurrentField = () => {
    const currentField = formFields[currentStep].name;
    const value = formData[currentField];

    if (!value || value.trim() === '') {
      setError(`${formFields[currentStep].label} is required`);
      return false;
    }

    if (currentField === 'email') {
      if (!value.includes('@')) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    if (currentField === 'password') {
      if (value.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    if (currentField === 'confirmPassword') {
      if (value !== formData.password) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentField()) {
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateCurrentField()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            security_question: formData.securityQuestion,
            security_answer: formData.securityAnswer
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setError('');
          onSignupSuccess({
            username: formData.username,
            email: formData.email
          });
        } else {
          setError(data.message || 'Signup failed. Please try again.');
        }
      } catch (err) {
        console.error('Signup error:', err);
        setError('Unable to connect to the server. Please check if the server is running.');
      } finally {
        setLoading(false);
      }
    }
  };

  const isCurrentFieldValid = () => {
    const currentField = formFields[currentStep].name;
    return formData[currentField] && formData[currentField].trim() !== '';
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <div className="signup-progress">
        {formFields.map((_, index) => (
          <div 
            key={index} 
            className={`progress-dot ${index === currentStep ? 'active' : ''} 
              ${index < currentStep ? 'completed' : ''}`}
          />
        ))}
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        {formFields.map((field, index) => (
          <div
            key={field.name}
            className={`form-step ${index === currentStep ? 'active' : ''}`}
            style={{ display: index === currentStep ? 'block' : 'none' }}
          >
            <div className="form-group">
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                autoComplete={field.type === 'password' ? 'new-password' : 'off'}
                disabled={loading}
              />
            </div>
          </div>
        ))}

        {error && <div className="error-message">{error}</div>}

        <div className="form-navigation">
          {currentStep > 0 && (
            <button 
              type="button" 
              onClick={handleBack}
              className="nav-button back-button"
              disabled={loading}
            >
              Back
            </button>
          )}
          
          {currentStep < formFields.length - 1 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="nav-button next-button"
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button 
              type="submit"
              className="nav-button submit-button"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          )}
        </div>
      </form>

      <div className="auth-switch">
        Already have an account?
        <button 
          type="button" 
          onClick={onSwitch}
          disabled={loading}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
