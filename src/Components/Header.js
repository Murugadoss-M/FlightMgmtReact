import React, { Component } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchUserData } from '../api/authenticationService'


class Header extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             data:{}
        }
    }
    async componentDidMount(){
        fetchUserData().then((response) => {
            this.setState({ data: response.data })
        })
    }
    render() {
        return (
            <div>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Container>
                            <Navbar.Brand href="/">ABC Travels</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav>
                                    <Nav.Link href="/login">Login</Nav.Link>
                                    <Nav.Link eventKey={2} href="/admin">
                                        Admin
                                    </Nav.Link>
                                    {this.state.data && <Nav.Link href="/logout">Logout</Nav.Link>}
                                    {this.state.data && this.state.data.roles && this.state.data.roles.filter(value => value.roleCode==='ADMIN').length>0 && <Nav.Link href="/admin/flight">Flights</Nav.Link> }
                                    {this.state.data && this.state.data.roles && this.state.data.roles.filter(value => value.roleCode==='ADMIN').length>0 && <Nav.Link href="/admin/bookings">All Bookings</Nav.Link> }
                                    <Nav.Link href="/checkin">Check In</Nav.Link>
                                    <Nav.Link href="/bookings">My Bookings</Nav.Link>
                                </Nav>
                                Hello {this.state.data && `${this.state.data.firstName} ${this.state.data.lastName}`}
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
            </div >
        )
    }
}

export default Header
