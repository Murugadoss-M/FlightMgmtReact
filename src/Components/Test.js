import axios from 'axios'
import React, { Component } from 'react'

class Test extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             msg:""
        }
    }
    
    async componentDidMount(){
        axios.get("http://localhost:8080/get",
            { headers: { authorization: 'Basic ' + window.btoa("user:password") } }
        ).then(response => response.data).then(data => this.setState({ msg: data }));
    }
    render() {
        console.log(this.state.msg);
        return (
            <div>
                Hello 
                <p>
                {this.state.msg}
                
                </p>
            </div>
        )
    }
}

export default Test

