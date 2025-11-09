import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Notyf } from 'notyf';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';


export default function Register() {
  const notyf = new Notyf();
  const { user, setUser } = useContext(UserContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
    notyf.error('Passwords do not match!');
    return; // Stop submission
  }

    setIsSubmitting(true);

    fetch('https://movie-app-3wql.onrender.com/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName })
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Registered Successfully') {
          notyf.success({ message: 'Registration Successful!', duration: 1000, dismissible: true });
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (data.error) {
          notyf.error(data.error);
        } else {
          notyf.error('Registration failed. Try again.');
        }
      })
      .catch(err => {
        console.error(err);
        notyf.error('Network error. Please try again later.');
      })
      .finally(() => {
        setIsSubmitting(false);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTermsAgreed(false);
      });
  }

  // Enable submit button dynamically
  const isActive = email && password && confirmPassword && termsAgreed;

  return (
    <div className="d-flex flex-column min-vh-100">
      <hr className="my-4" />
      <Container
        fluid
        className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5"
        id="register"
      >
        <Row className="justify-content-center w-100">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="card card-custom p-4 shadow">
              <div className="text-center mb-4">
                <h1 className="mb-2">Create Account</h1>
                <p className="text-muted mb-0">
                  Join now to watch your favorite movies online
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                {/* Full Name */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="form-control-custom"
                  />
                  <i className="bi bi-person form-icon-left"></i>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="form-control-custom"
                  />
                  <i className="bi bi-envelope form-icon-left"></i>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-control-custom"
                  />
                  <i className="bi bi-lock form-icon-left"></i>
                  <i
                    className={showPassword ? 'bi bi-eye form-icon-right' : 'bi bi-eye-slash form-icon-right'}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="form-control-custom"
                  />
                  <i className="bi bi-lock form-icon-left"></i>
                  <i
                    className={showConfirm ? 'bi bi-eye form-icon-right' : 'bi bi-eye-slash form-icon-right'}
                    onClick={() => setShowConfirm(!showConfirm)}
                  ></i>
                </Form.Group>

                {/* Terms */}
                <div className="mb-3 d-flex align-items-center gap-2">
                  <div
                    className={`checkbox-custom ${termsAgreed ? 'checked' : ''}`}
                    onClick={() => setTermsAgreed(!termsAgreed)}
                  >
                    <i className="bi bi-check"></i>
                  </div>
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="btn-primary-custom w-100" disabled={!isActive || isSubmitting}>
                  <i className="bi bi-person-plus"></i> {isSubmitting ? 'Submitting...' : 'Create Account'}
                </Button>

                {/* Login Link */}
                <p className="text-center text-muted mt-3 mb-0">
                  Have an account? 
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none ms-1">
                    Login here
                  </Link>
                </p>

                <hr className="my-4" />

                {/* Social Login */}
                <p className="text-center text-muted small mb-3">Or continue with</p>
                <div className="d-flex justify-content-center gap-3">
                  <button type="button" className="social-btn">
                    <i className="bi bi-google text-danger"></i>
                  </button>
                  <button type="button" className="social-btn">
                    <i className="bi bi-facebook text-primary"></i>
                  </button>
                  <button type="button" className="social-btn">
                    <i className="bi bi-apple text-dark"></i>
                  </button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
