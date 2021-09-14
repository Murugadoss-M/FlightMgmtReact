import axios from 'axios'
import { fetchUserData } from '../api/authenticationService'
import { Badge, Button, Modal } from 'react-bootstrap'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Checkout extends Component {
    constructor(props) {
        super(props)

        this.state = {
            booking: {},
            passengers: [],
            flight: {},
            data: {},
            reference: null
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

    loadScript = async (src) => {
        return new Promise(res => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                res(true);
            };
            script.onerror = () => {
                res(false);
            };
            document.body.appendChild(script);
        })
    };


    displayRazorpay = (price) => {
        try {
            const res = this.loadScript('https://checkout.razorpay.com/v1/checkout.js');
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?')
                return
            }
            // const data = fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
            //     t.json())

            // console.log(data)
            var refer;
            const options = {
                key:'rzp_test_eL2w4zKAPU2Iyn',
                currency: 'INR',//data.currency,
                amount: 100*100,
                //order_id: data.id,
                name: 'Ticket payment',
                description: 'Thank you for booking with us.',
                handler: function (response) {
                    axios.post("http://localhost:9000/booking/book")
                    .then(response => refer= response.data)
                  },
                prefill: {
                    name:'ABC Travels',
                    email: 'sdfdsjfh2@ndsfdf.com',
                    phone_number: '9899999999'
                }
            }
            const paymentObject = new window.Razorpay(options)
            paymentObject.open()
            this.setState({reference:refer})
            


        } catch (error) {
            console.log(error.message);
        }

    }

    render() {
        return (
            <div className="center">
                {this.state.reference === null && <table className="center-table">
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
                            <td colSpan="2"><Button variant="primary" onClick={()=>this.displayRazorpay(this.state.booking.price)}>Pay</Button></td>
                        </tr>
                    </tfoot>
                </table>}
                {this.state.reference &&
                    <Modal.Dialog>
                        <Modal.Header closeButton>
                            <Modal.Title>Booking confirmation</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>Thank you for your booking.</p>
                            <p>Your reference number {this.state.reference}</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="outline-dark"><strong><Link to="/">
                                Home
                            </Link></strong></Button>
                            <Button variant="outline-dark"><strong><Link to="/checkin">
                                CheckIn
                            </Link></strong></Button>
                        </Modal.Footer>
                    </Modal.Dialog>}
            </div>
        )
    }
}

export default Checkout
