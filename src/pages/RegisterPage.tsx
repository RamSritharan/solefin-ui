import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { FiDollarSign } from 'react-icons/fi';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  businessName: Yup.string().required('Business name is required'),
});

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <FiDollarSign size={40} color="var(--primary)" />
          <h1>SoleFin</h1>
          <p>Create your account</p>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '', businessName: '' }}
          validationSchema={registerSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setError('');
              await register(values.email, values.password, values.name, values.businessName);
              navigate('/dashboard');
            } catch (err: any) {
              setError(err.message);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <Field type="text" name="name" id="name" className="form-control" placeholder="John Doe" />
                <ErrorMessage name="name" component="div" className="form-error" />
              </div>
              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <Field
                  type="text"
                  name="businessName"
                  id="businessName"
                  className="form-control"
                  placeholder="My Business LLC"
                />
                <ErrorMessage name="businessName" component="div" className="form-error" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" id="email" className="form-control" placeholder="you@example.com" />
                <ErrorMessage name="email" component="div" className="form-error" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  className="form-control"
                  placeholder="At least 6 characters"
                />
                <ErrorMessage name="password" component="div" className="form-error" />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="form-control"
                  placeholder="Re-enter your password"
                />
                <ErrorMessage name="confirmPassword" component="div" className="form-error" />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
