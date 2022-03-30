import { Col, Container, Nav, Navbar } from 'react-bootstrap'
import { FiLogOut, FiSettings } from 'react-icons/fi'

export interface TopBarProps {
  brand: string
}

export const TopBar = ({ brand }: TopBarProps) => {
  return (
    <Navbar variant='dark'>
      <Container fluid={true} className='no-gutter'>
        <Col md={2}>
          <Navbar.Brand>{brand}</Navbar.Brand>
        </Col>
        <Nav className="justify-content-end">
          <Nav.Link href="/log-out">
            <FiLogOut/>
          </Nav.Link>
          <Nav.Link href="/settings">
            <FiSettings/>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}
