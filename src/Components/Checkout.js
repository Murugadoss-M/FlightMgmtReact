import axios from 'axios'
import { fetchUserData } from '../api/authenticationService'
import { Badge,Button } from 'react-bootstrap'
import React, { Component } from 'react'

class Checkout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            booking: {},
            passengers: [],
            flight: {},
            data: {}
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
        axios.post("http://localhost:9000/booking/get").then(response => response.data)
            .then(data => {
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
                axios.post("http://localhost:9000/booking/passengers", null)
                    .then(response => this.setState({ passengers: response.data }))
            })
            .then(() => {
                axios.post("http://localhost:9000/search/id", null, {
                    params: {
                        id: this.state.booking.flight_id
                    }
                }).then(response => response.data).then(data => this.setState({ flight: data }))
            })
            .then(console.log(this.state))


    }

    render() {
        return (
            <div className="center">
                <table className="center-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody className="left-align">
                        <tr>
                            <td><Badge pill bg="light" text="dark">Flight id</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.booking.flight_id}</Badge></td>
                        </tr>
                        <tr>
                            <td><Badge pill bg="light" text="dark">Source</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.flight.from}</Badge></td>
                        </tr>
                        <tr>
                            <td><Badge pill bg="light" text="dark">Destination</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.flight.to}</Badge></td>
                        </tr>
                        <tr>
                            <td><Badge pill bg="light" text="dark">Date</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.flight.date}</Badge></td>
                        </tr>
                        <tr>
                            <td><Badge pill bg="light" text="dark">Passengers</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.passengers.length}</Badge></td>
                        </tr>
                        <tr>
                            <td><Badge pill bg="light" text="dark">Price</Badge></td>
                            <td><Badge pill bg="light" text="dark">{this.state.booking.price}</Badge></td>
                        </tr>

                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="2"><Button variant="primary">Pay</Button></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }
}

export default Checkout
