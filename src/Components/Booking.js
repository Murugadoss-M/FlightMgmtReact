import React, { Component } from 'react'
import axios from 'axios'
import {Badge} from 'react-bootstrap'
import { fetchUserData } from '../api/authenticationService'

class Booking extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {},
            booking: []
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
        axios.post("http://localhost:9000/booking/user/booking", null, {
            params: {
                username: "mmdoss"
            }
        }).then(response => response.data)
            .then(data => { this.setState({ booking: data }) })



    }

    render() {
        return (
            <div className="center">
                <table className="center-table">
                    <thead>
                        <tr>
                            <th>Sl.No</th><th>Booking ID</th><th>Flight ID</th><th>Date</th><th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.booking.map((booking, idx) => (
                            <tr key={idx}>
                                <td><Badge pill bg="light" text="dark">{idx+1}</Badge></td>
                                <td><Badge pill bg="light" text="dark">{booking.booking_id}</Badge></td>
                                <td><Badge pill bg="light" text="dark">{booking.flight_id}</Badge></td>
                                <td><Badge pill bg="light" text="dark">{booking.date}</Badge></td>
                                <td><Badge pill bg="light" text="dark">{booking.price}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Booking
