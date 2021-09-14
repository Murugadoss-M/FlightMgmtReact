import React from 'react'
import {Badge} from 'react-bootstrap'

function display(props) {
    
    if(props==="true"){
        return (
            <div>
                <Badge pill bg="light" text="dark">Cancelled</Badge>
            </div>
        )     
    }
    else{
        return (
            <div>
                <Badge pill bg="light" text="dark">Active</Badge>
            </div>
        ) 
    }
    
}

export default display
