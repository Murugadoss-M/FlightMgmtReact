import axios from 'axios';
import React from 'react'
import {Button} from 'react-bootstrap'

function Payment(props) {
    const loadScript = (src) => {
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

    const displayRazorpay = async () => {
        try {
            const res = loadScript('https://checkout.razorpay.com/v1/checkout.js');
            if (!res) {
                alert("network error");
                return;
            }
            const { data } = await axios.post("http://localhost:8999/payment/order");
            if (!data) {
                alert("network error");
                return;
            }
            const { amount, id: order_id, currency } = data;
            const options = {
                key: 'rzp_test_9Hk3SCVOeMv7VR',
                amount: props.amount,
                currency,
                name: "Booking payment",
                description: "Thank you for booking with us",
                image: "",
                order_id,
                handler: async function(response){
                    const data={
                        orderCreationId:order_id,
                        razorpayPaymentId:response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature:response.razorpay_signature,
                        amount:amount.toString(),
                        currency
                    }

                    const result= await axios.post("http://localhost:8999/payment/verify",data);
                    console.log(result.data);
                },
                prefill:{
                    name:"some name",
                    email:"12312@asfda.com",
                    contact:"9999999999"
                }
            }
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.log(error.message);
        }
    }
    return (
        <>
            <Button variant="primary" onClick={displayRazorpay}>Pay</Button>
        </>
    )
}

export default Payment
