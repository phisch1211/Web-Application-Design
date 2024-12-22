import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

const FooterComponent=()=>
{
    return (
        <Navbar expand="lg" className="bg-body-tertiary" fixed='bottom'>
      <Container fluid>
        <Navbar.Brand href="#">ENJOY THE SHOP!!!</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/newBooks">Find</Nav.Link>
            <Nav.Link href="/bookDetails">Share</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Button variant="outline-success" href="mailto:phisch@ktu.lt">Support</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default FooterComponent;