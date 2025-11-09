import { useState } from 'react';
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Notyf } from 'notyf';
import { Link } from 'react-router-dom';

export default function Register() {
  const notyf = new Notyf();

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
      return;
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
          setTimeout(() => window.location.href = '/login', 2000);
        } else {
          notyf.error(data.error || 'Registration failed. Try again.');
        }
      })
      .catch(() => notyf.error('Network error. Please try again later.'))
      .finally(() => {
        setIsSubmitting(false);
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTermsAgreed(false);
      });
  }

  const isActive = email && password && confirmPassword && termsAgreed;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container fluid className="flex-grow-1 d-flex flex-column justify-content-center align-items-center py-5" id="register">
        <Row className="justify-content-center w-100">
          <Col xs={12} sm={8} md={6} lg={4}>
            <div className="card card-custom p-4 shadow">
              <h1 className="text-center mb-2">Create Account</h1>
              <p className="text-center text-muted mb-4">Join now to watch your favorite movies online</p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your password" />
                </Form.Group>

                <div className="mb-3 d-flex align-items-center gap-2">
                  <div className={`checkbox-custom ${termsAgreed ? 'checked' : ''}`} onClick={() => setTermsAgreed(!termsAgreed)}>
                    <i className="bi bi-check"></i>
                  </div>
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </div>

                <Button type="submit" className="btn-primary-custom w-100" disabled={!isActive || isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Create Account'}
                </Button>

                <p className="text-center text-muted mt-3 mb-0">
                  Have an account?
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none ms-1">Login here</Link>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
