import React, { Component } from 'react'
import { Form, Button, Badge, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { fetchUserData } from '../api/authenticationService'
import axios from 'axios'

class Checkin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {},
            reference: "",
            booking: {},
            passengers: [],
            seatNo: "",
            status: null
        }
    }
    componentDidMount() {
        fetchUserData().then((response) => {
            this.setState({ data: response.data })
        })
            .catch((e) => {
                localStorage.clear();
                this.props.history.push('/login');
            })
        this.setState({
            status: null,
            booking: {},
            passengers:[],
            reference:"",
            seatNo:""
        })
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    findBooking = () => {
        axios.post("http://localhost:9000/checkin/getbooking", null, {
            params: {
                booking_id: this.state.reference
            }
        }).then(response => response.data).then(data => {
            this.setState({
                booking: {
                    booking_id: data.booking_id,
                    username: data.username,
                    flight_id: data.flight_id,
                    date: data.date,
                    price: data.price,
                    isCancelled: data.isCancelled
                }
            })
        }).then(() => {
            axios.post("http://localhost:9000/checkin/getpassengers", null, {
                params: {
                    booking_id: this.state.reference
                }
            }).then(response => this.setState({ passengers: response.data }))
        })

    }
    checkin = (idx) => {
        axios.post("http://localhost:9000/checkin/checkin", null, {
            params: {
                index: idx,
                seat: this.state.seatNo
            }
        }).then(response => this.setState({ passengers: response.data }))
    }
    confirm = () => {
        axios.post("http://localhost:9000/checkin/book").then(response => this.setState({ status: response.data }))
    }
    render() {
        return (
            <div className="center">
                <table className="center-table">
                    <thead>
                        <tr>
                            <th><Form.Control type="text" placeholder="Enter reference number" name="reference" onChange={this.handleChange} /></th>
                            <th><Button variant="primary" onClick={this.findBooking}>Search</Button></th>
                        </tr>
                    </thead>
                </table>
                <table className="center-table">
                    <tbody>
                        <tr>
                            <th>Booking ID</th>
                            <th>Flight ID</th>
                            <th>Date</th>
                            <th>Price</th>
                        </tr>
                        <tr>
                            <td><Badge pill bg="light" text="dark">{this.state.booking.booking_id}</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.booking.flight_id}</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.booking.date}</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.booking.price}</Badge></td>
                        </tr>
                    </tbody>
                </table>
                <table className="center-table">
                    <tbody>
                        <tr>
                            <th>Passenger Name</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Seat No</th>
                            <th>Check In</th>
                        </tr>
                        {this.state.passengers.map((passenger, idx) =>
                            <tr key={idx}>
                                <td><Badge pill bg="light" text="dark">{passenger.name}</Badge></td>
                                <td><Badge pill bg="light" text="dark">{passenger.gender}</Badge></td>
                                <td><Badge pill bg="light" text="dark">{passenger.age}</Badge></td>
                                <td>{passenger.seatNo === 0 ?
                                    <Form.Select name="seatNo" onChange={this.handleChange}>
                                        <option value="" >Seat No</option>
                                        {(Array(100).fill().map((_, idx) => 1 + idx)).map((age) =>
                                            <option key={age} value={age}>{age}</option>
                                        )}
                                    </Form.Select>
                                    : <Badge pill bg="light" text="dark">{passenger.seatNo}</Badge>}</td>
                                <td>{passenger.isCheckedIn === true ?
                                    <Button variant="primary" disabled>Check In</Button>
                                    : <Button variant="primary" onClick={() => this.checkin(idx)}>Check In</Button>
                                }</td>
                            </tr>)}
                        <tr>
                            <td colSpan="5"><center><Button variant="primary" onClick={this.confirm}>Confirm</Button></center></td>
                        </tr>
                    </tbody>
                </table>
                {this.state.status &&
                    <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>CheckIn Confirmation</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>CheckIn Confirmed</p>
                            <p>Your reference number {this.state.reference}</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="outline-dark"><strong><Link to="/">
                                Home
                            </Link></strong></Button>
                        </Modal.Footer>
                    </Modal.Dialog>}

            </div>
        )
    }
}

export default Checkin
