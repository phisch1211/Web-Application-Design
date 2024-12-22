import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React, { useRef } from 'react';
import axios from 'axios';
import { redirect } from 'react-router-dom';

const LoginPage = () => {
  const passwordRef = useRef(null);
  const emailRef = useRef(null);
  const confirmRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const password = passwordRef.current.value;
    const email = emailRef.current.value;
    const confirm = confirmRef.current.value;

    try {
      const response = await axios.post("http://localhost:3000/api/user/", {
        email,
        password,
        confirm,
        admin:false
      });
      // Handle success, e.g., show a success message or redirect
      alert('User created: ' + response.data.message);
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userID', response.data.creatorID)
      localStorage.setItem('isADM', response.data.admin)
      window.location.href = "./login";
    } catch (err) {
      // Handle error, e.g., show an error message
      if(err.status==400)
      alert('Bad request:');
      else if(err.status==403)
      alert('Email is already used');
      else if(err.status==401)
      alert('Password and confirmation are not the same');
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

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          id="confirm"
          style={{ width: '80%', maxWidth:500 }}
          ref={confirmRef}
          required
        />
      </Form.Group>
  
      <Button variant="primary" type="submit">Create Account</Button>
      <Button variant="outline-secondary" href="./login">Log-in</Button>
    </Form>
  );
};



export default LoginPage;