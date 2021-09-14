import axios from 'axios'
import React, { Component } from 'react'
import { ButtonGroup, Button, Badge, Form } from 'react-bootstrap'
import { fetchUserData } from '../api/authenticationService'
//import display from './display'

class Admin extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: {},
            flights: [],
            bookings: [],
            airports: [],
            toggleFlight: true,
            toggleAirport: false,
            toggleBooking: false,
            airportId: "",
            airportName: "",
            flightId:"",
            airways:"",
            from:"",
            to:"",
            date:"",
            seats:"",
            cost:""
        }
    }

    handleChange = (event) => {
        event.preventDefault()
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    addAirport = () => {
        axios.post("http://localhost:9000/admin/add/airport", null, {
            params: {
                "id": this.state.airportId,
                "city": this.state.airportName
            }
        }).then(response => response.data).then(data => this.setState({ airports: data }))

    }
    deleteAirport=(key)=>{
        axios.post("http://localhost:9000/admin/delete/airport",null,{
            params:{
                "id":key
            }
        }).then(response=>response.data).then(data=>this.setState({airports:data}))
    }
    deleteFlight=(key)=>{
        axios.post("http://localhost:9000/admin/delete/flight",null,{
            params:{
                "id":key
            }
        }).then(response=>response.data).then(data=>this.setState({flights:data}))
    }

    addFlight=()=>{
        console.log("Add Flight")
        axios.post("http://localhost:9000/admin/add/flight", null, {
            params: {
                "id": this.state.flightId,
                "airways":this.state.airways,
                "from":this.state.from,
                "to":this.state.to,
                "date":this.state.date,
                "seats":this.state.seats,
                "cost":this.state.cost

            }
        }).then(response => response.data).then(data => this.setState({ flights: data }))
    }

    componentDidMount() {
        fetchUserData().then((response) => {
            this.setState({ data: response.data })
        }).then(() => {
            axios.get("http://localhost:9000/admin/view/flight").then(response => response.data)
                .then(data => this.setState({ flights: data }))
            axios.get("http://localhost:9000/admin/view/airport").then(response => response.data)
                .then(data => this.setState({ airports: data }))
            axios.get("http://localhost:9000/admin/view/booking").then(response => response.data)
                .then(data => this.setState({ bookings: data }))
        }).then(console.log(this.state))
            .catch((e) => {
                localStorage.clear();
                this.props.history.push('/login');
            })

    }

    cancelBooking=(booking_id)=>{
        axios.post("http://localhost:9000/admin/cancel/booking",null,{
            params:{
                id:booking_id
            }
        }).then(response=>this.setState({bookings:response.data}))
    }
    activateBooking=(booking_id)=>{
        axios.post("http://localhost:9000/admin/activate/booking",null,{
            params:{
                id:booking_id
            }
        }).then(response=>this.setState({bookings:response.data}))
    }

    render() {
        return (
            <div>
                <ButtonGroup aria-label="Basic example">
                    <Button variant="secondary" onClick={() => this.setState({
                        toggleFlight: true,
                        toggleAirport: false,
                        toggleBooking: false,
                    })}>Flights</Button>
                    <Button variant="secondary" onClick={() => this.setState({
                        toggleFlight: false,
                        toggleAirport: true,
                        toggleBooking: false,
                    })}>Airports</Button>
                    <Button variant="secondary" onClick={() => this.setState({
                        toggleFlight: false,
                        toggleAirport: false,
                        toggleBooking: true,
                    })}>Bookings</Button>
                </ButtonGroup>

                {this.state.toggleFlight &&
                    <table className="center-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Airways</th><th>Date</th><th>Source</th><th>Destination</th><th>Seats</th><th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><Form.Control type="text" placeholder="Id" name="flightId" onChange={this.handleChange} /></td>
                                <td><Form.Control type="text" placeholder="Airways" name="airways" onChange={this.handleChange} /></td>
                                <td className="cellpad">
                                    <Form.Control type="date" name='date' onChange={this.handleChange} />
                                </td>
                                <td><Form.Select name="from" onChange={this.handleChange}>
                                    <option value="" >Source</option>
                                    {this.state.airports.map((airport) =>
                                        <option key={airport.id} value={airport.city}>{airport.city}</option>
                                    )}
                                </Form.Select></td>
                                <td><Form.Select name="to" onChange={this.handleChange}>
                                    <option value="" >Destination</option>
                                    {this.state.airports.map((airport) =>
                                        <option key={airport.id} value={airport.city}>{airport.city}</option>
                                    )}
                                </Form.Select></td>
                                <td><Form.Control type="text" placeholder="Seats" name="seats" onChange={this.handleChange} /></td>
                                <td><Form.Control type="text" placeholder="Cost" name="cost" onChange={this.handleChange} /></td>
                                <td><Button variant="primary" onClick={this.addFlight}>Add</Button></td>
                                
                            </tr>
                            {this.state.flights.map((flight, idx) =>
                                <tr key={idx}>
                                    <td><Badge pill bg="light" text="dark">{flight.flight_id}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{flight.airways}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{flight.date}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{flight.from}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{flight.to}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{flight.seats}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">₹{flight.cost}</Badge></td>
                                    <td><Button variant="primary" onClick={()=>this.deleteFlight(flight.flight_id)}>Delete</Button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                }
                {this.state.toggleAirport &&
                    <table className="center-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>City</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="cellpad"><Form.Control type="text" placeholder="Id" name="airportId" onChange={this.handleChange} /></td>
                                <td><Form.Control type="text" placeholder="Enter city" name="airportName" onChange={this.handleChange} /></td>
                                <td><Button variant="primary" onClick={this.addAirport}>Add</Button></td>
                            </tr>
                            {this.state.airports.map((airport, idx) =>
                                <tr key={idx}>
                                    <td><Badge pill bg="light" text="dark">{airport.id}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{airport.city}</Badge></td>
                                    <td><Button variant="primary" onClick={()=>this.deleteAirport(airport.id)}>Delete</Button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                }
                {this.state.toggleBooking &&
                    <table className="center-table">
                        <thead>
                            <tr>
                                <th>ID</th><th>Flight_id</th><th>Username</th><th>Date</th><th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bookings.map((booking, idx) =>
                                <tr key={idx}>
                                    <td><Badge pill bg="light" text="dark">{booking.booking_id}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{booking.flight_id}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{booking.username}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">{booking.date}</Badge></td>
                                    <td><Badge pill bg="light" text="dark">₹{booking.price}</Badge></td>
                                    <td><Button variant="primary" onClick={()=>this.cancelBooking(booking.booking_id)}>Cancel</Button></td>
                                    <td><Button variant="primary" onClick={()=>this.activateBooking(booking.booking_id)}>Activate</Button></td>
                                </tr>
                            )} 
                        </tbody>
                    </table>
                }

            </div>
        )
    }
}

export default Admin
