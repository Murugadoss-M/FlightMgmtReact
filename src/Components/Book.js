import axios from 'axios'
import React, { Component } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import { Form, Col, Button } from 'react-bootstrap'
import { fetchUserData } from '../api/authenticationService'

class Book extends Component {

    constructor(props) {
        super(props)
        this.state = {
            flight: {},
            passengers: [],
            name: "",
            gender: "",
            age: 0,
            data: {}
        }
    }

    //Passenger form input handler
    handleChange = (event) => {
        this.setState(
            {
                [event.target.name]
                    : event.target.value
            }
        )
    }

    //Load initial state
    async componentDidMount() {
        fetchUserData().then((response) => {
            this.setState({ data: response.data })
        }).catch((e) => {
            localStorage.clear();
            this.props.history.push('/login');
        })
        axios.post("http://localhost:9000/search/id", null,
            {
                params:
                {
                    id: this.props.match.params.id
                }

            }).then(response => response.data).then(data => this.setState({ flight: data }))
    }

    //Add passenger to server
    addPassenger = (event) => {
        event.preventDefault();
        axios.post("http://localhost:9000/booking/addpassenger", null, {
            params: {
                "name": this.state.name,
                "gender": this.state.gender,
                "age": this.state.age
            }
        })
            .then(response => response.data).then(data => this.setState({
                passengers: data
            }))
    }


    //delete passenger from server
    deletePassenger = (index) => {
        axios.post("http://localhost:9000/booking/deletepassenger", null, {
            params: {
                "index": index
            }
        }).then(response => response.data).then(data => this.setState({
            passengers: data
        }))
    }


    //Book ticket calling payment portal
    bookTicket = (event) => {
        event.preventDefault();
        if (this.state.passengers.length === 0)
            alert("Add Passengers");
        else {
            axios.post("http://localhost:9000/booking/create", null, {
                params: {
                    "flightid": this.state.flight.flight_id,
                    "username": this.state.data.userName
                }
            }).then(this.props.history.push("/checkout"))


        }
    }

    render() {
        return (
            <div className="center">
                <h2><center>Book Ticket</center></h2>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Flight Details</Accordion.Header>
                        <Accordion.Body>
                            <table className="center-table">
                                <thead>
                                    <tr>
                                        <th>Source</th>
                                        <th>Destination</th>
                                        <th>Date</th>
                                        <th>Fare</th>
                                    </tr>
                                    <tr>
                                        <td>{this.state.flight.from}</td>
                                        <td>{this.state.flight.to}</td>
                                        <td>{this.state.flight.date}</td>
                                        <td>{this.state.flight.cost}</td>
                                    </tr>
                                </thead>
                            </table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <table className="center-table">
                    <tbody>
                        <tr>
                            <td>
                                <Form.Control type="text" placeholder="Name" name="name" onChange={this.handleChange} />
                            </td>
                            <td>
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check
                                            inline
                                            label="Male"
                                            name="gender"
                                            type={type}
                                            id={`inline-${type}-1`}
                                            value="M"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="Female"
                                            name="gender"
                                            type={type}
                                            id={`inline-${type}-2`}
                                            value="F"
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                ))}
                            </td>
                            <td>
                                <Col xs="auto">
                                    <Form.Select name="age" onChange={this.handleChange}>
                                        <option value="" >Age</option>
                                        {(Array(100).fill().map((_, idx) => 1 + idx)).map((age) =>
                                            <option key={age} value={age}>{age}</option>
                                        )}
                                    </Form.Select>
                                </Col>
                            </td>
                            <td>
                                <Button onClick={this.addPassenger}>Add</Button>
                            </td>
                        </tr>

                    </tbody>
                </table>
                <table className="center-table">
                    <thead>
                        <tr>
                            <th>S.no</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.passengers.map((passenger, idx) =>
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{passenger.name}</td>
                                <td>{passenger.gender}</td>
                                <td>{passenger.age}</td>
                                <td><Button onClick={() => this.deletePassenger(idx)}>Delete</Button></td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="4"><Button onClick={this.bookTicket}>Book Ticket</Button></td>
                        </tr>
                    </tbody>
                </table>

            </div >
        )
    }
}

export default Book
