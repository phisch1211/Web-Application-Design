import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'C:/Users/philipp.schlaus/OneDrive - CGM/Dokumente/Web Application Design/frontend/src/App.css';

const HeaderComponent=()=>
{
    return <Navbar expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="#home">Blind-Book-Buying</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/login">Log-In</Nav.Link>
          <NavDropdown title="Options" id="basic-nav-dropdown">
            <NavDropdown.Item href="/newBooks">Search Book</NavDropdown.Item>
            <NavDropdown.Item href="/bookDetails">
              Recommend Book
            </NavDropdown.Item>
            <NavDropdown.Item href="/user">Account</NavDropdown.Item>
            <NavDropdown.Divider />
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
}

export default HeaderComponent;