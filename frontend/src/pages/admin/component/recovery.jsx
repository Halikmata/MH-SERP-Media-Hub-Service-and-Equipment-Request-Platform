import React, { useState } from 'react';

const Recovery = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Email Input, 2: Code Input, 3: Password Reset
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const backendUrl = import.meta.env.VITE_API_URL;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${backendUrl}/recover_account`, {
        method: 'POST', // Ensure this is 'POST'
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Show success message
        setStep(2); // Move to step 2
      } else {
        setError(data.error); // Show error message
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error during account recovery:', err);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${backendUrl}/verify_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Show success message
        setStep(3); // Move to step 3
      } else {
        setError(data.error); // Show error message
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error during code verification:', err);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/reset_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Show success message
        setStep(1); // Reset to step 1
        setEmail(''); // Clear inputs
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error); // Show error message
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error during password reset:', err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Account Recovery</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-3">
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit}>
            <div className="mb-3">
              <input
                type="text"
                id="code"
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter the 6-digit code"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-3">
              <input
                type="password"
                id="newPassword"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Recovery;
