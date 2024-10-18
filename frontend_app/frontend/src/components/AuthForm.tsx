import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface AuthFormProps {
  type: 'login' | 'signup'; // Tip forme (login ili signup)
  onSubmit: (formData: { fullName?: string; email: string; password: string }) => void; 
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={styles.container}>
      <h2>{type === 'signup' ? 'Sign Up' : 'Log In'}</h2>
      <form style={styles.form} onSubmit={handleSubmit}>
        {type === 'signup' && ( // Puno ime je potrebno samo za signup formu
          <div style={styles.inputGroup}>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
              required 
            />
          </div>
        )}
        <div style={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required 
          />
        </div>
        <div style={styles.inputGroup}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required 
          />
        </div>
        <button type="submit" style={styles.button}>
          {type === 'signup' ? 'Create Account' : 'Log In'}
        </button>
      </form>
      <div style={styles.footer}>
        {type === 'signup' ? (
          <>
            Already have an account? <Link to="/login">Log In</Link>
          </>
        ) : (
          <>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </div>
  );
};

// Stilovi sa TypeScript podrškom
const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center' as const, 
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  inputGroup: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
};

export default AuthForm;
