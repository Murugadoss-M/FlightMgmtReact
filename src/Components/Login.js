import axios from 'axios'
import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap'



class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: "",
            success: ""
        }
    }

    handleChange = (event) => {
        this.setState(
            {
                [event.target.name]
                    : event.target.value
            }
        )
        console.log(this.state);
    }
    loginHandler = () => {
        axios.post("http://localhost:9000/booking/login",
            { headers: { authorization: 'Basic ' + window.btoa(this.state.username+":"+this.state.password) } }
        ).then(response => response.data).then(data => this.setState({ success: data }));
        if(this.state.success==="success"){
            this.history.push("/")
        }
    }
    render() {
        return (
            <div className="login">
                <center><h3>User Login</h3></center>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Enter username" name="username" onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} />
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.loginHandler}>
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Login


