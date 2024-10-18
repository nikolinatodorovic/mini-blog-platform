import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, loginSchema, FormData } from '../validation/formValidation';
import '../styles/AuthForm.css'; 

interface AuthFormProps {
  type: 'login' | 'signup'; 
  onSubmit: (formData: FormData) => void; 
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(type === 'signup' ? signupSchema : loginSchema),
  });

  const onSubmitHandler: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmitHandler)}>
      {type === 'signup' && (
        <div className="field">
          <input
            type="text"
            {...register('fullName')}
            required
          />
          <label>Full Name</label>
          {errors.fullName && <span>{errors.fullName.message}</span>}
        </div>
      )}
      <div className="field">
        <input
          type="email"
          {...register('email')}
          required
        />
        <label>Email Address</label>
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      <div className="field">
        <input
          type="password"
          {...register('password')}
          required
        />
        <label>Password</label>
        {errors.password && <span>{errors.password.message}</span>}
      </div>
      <div className="field">
        <input type="submit" value={type === 'signup' ? 'Create Account' : 'Log In'} />
      </div>
      <div className="signup-link">
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
    </form>
  );
};

export default AuthForm;
