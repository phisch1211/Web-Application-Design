import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useRef } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const passwordRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const password = passwordRef.current.value;
    const email = emailRef.current.value;

    try {
      const response = await axios.put("http://localhost:3000/api/user/", {
        email,
        password
      });
      alert('You are logged in!');
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('userID', response.data.data.id)
      localStorage.setItem('isADM', response.data.data.admin)
      window.location.href = "./";
    } catch (err) {
      // Handle error, e.g., show an error message
      alert('Logging in failed');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          id="email"
          style={{ width: '80%', maxWidth:500 }}
          ref={emailRef}
          required
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          id="password"
          style={{ width: '80%', maxWidth:500 }}
          ref={passwordRef}
          required
        />
      </Form.Group>
  
      <Button variant="primary" type="submit">Submit</Button>
      <Button variant="outline-secondary" href="./register">Create Account</Button>
    </Form>
  );
};

export default LoginPage;