import React, { Component } from 'react'
import axios from 'axios'
import { Form, Button, Badge } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

class Search extends Component {
    constructor(props) {
        super(props)

        this.state = {
            flights: [],
            from: "",
            to: "",
            date: "",
            airports: []
        }
    }


    //Initial State Loading
    async componentDidMount() {
        axios.get("http://localhost:9000/search/airport", null, null)
            .then(response => response.data).then(data => this.setState({ airports: data }));
        console.log(this.state.airports);

    }
    //Searching Flights
    submitHandler = (event) => {
        axios.post("http://localhost:9000/search/flight", null,
            {
                params:
                {
                    "date": this.state.date,
                    "from": this.state.from,
                    "to": this.state.to
                },

            })
            .then(response => response.data).then(data => this.setState({ flights: data }));
        event.preventDefault();
        console.log(this.state.flights);

    }
    //Handler method for form change
    handleChange = (event) => {
        this.setState(
            {
                [event.target.name]
                    : event.target.value
            }
        )
        console.log(this.state);
    }
    //Book button to switch components
    bookFlight = (flight_id) => {
        this.props.history.push("/book")
    }
    render() {
        return (
            <>
                <div className="center">
                    <table className="center-table">
                        <tbody>
                            <tr>
                                <td className="cellpad">
                                    <Form.Select name="from" onChange={this.handleChange}>
                                        <option value="" >Source</option>
                                        {this.state.airports.map((airport) =>
                                            <option key={airport.id} value={airport.city}>{airport.city}</option>
                                        )}
                                    </Form.Select>
                                </td>
                                <td className="cellpad">
                                    <Form.Select name="to" onChange={this.handleChange}>
                                        <option value="" >Destination</option>
                                        {this.state.airports.map((airport) =>
                                            <option key={airport.id} value={airport.city}>{airport.city}</option>
                                        )}
                                    </Form.Select>
                                </td>
                                <td className="cellpad">
                                    <Form.Control type="date" name='date' onChange={this.handleChange} />
                                </td>
                                <td className="cellpad">
                                    <Button variant="outline-primary" onClick={this.submitHandler}>Submit</Button>{' '}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="center">
                    <table className="center-table">
                        <tbody>
                            {this.state.flights.length === 0 ?
                                <tr>
                                    <td colSpan="6">No Flights Available</td>
                                </tr> :
                                this.state.flights.map((flight) => <tr key={flight.flight_id}>
                                    <td><h4><Badge pill bg="light" text="dark">
                                        {flight.airways}
                                    </Badge></h4></td>
                                    <td><h4><Badge pill bg="light" text="dark">
                                        {flight.from}
                                    </Badge></h4></td>
                                    <td><h4><Badge pill bg="light" text="dark">
                                        {flight.to}
                                    </Badge></h4></td>
                                    <td><h4><Badge pill bg="light" text="dark">
                                        ₹{flight.cost}
                                    </Badge></h4></td>
                                    <td><h4>
                                        <Button variant="outline-dark">
                                            <strong>
                                                <Link to={`/book/${flight.flight_id}`}>
                                                    Book
                                                </Link>
                                            </strong>
                                        </Button>
                                    </h4></td>
                                </tr>)}

                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}


export default Search
