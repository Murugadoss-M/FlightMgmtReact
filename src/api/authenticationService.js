import axios from 'axios';

//Get current token from redux store
export const getToken=()=>{
    return localStorage.getItem('USER_KEY');
}

//Authentication handler
export const userLogin=(authRequest)=>{
    return axios({
        'method':'POST',
        'url':`http://localhost:8083/api/v1/auth/login`,
        'data':authRequest
    })
}

//To fetch currently logged in user data from server
export const fetchUserData=(authRequest)=>{
    return axios({
        method:'GET',
        url:`http://localhost:8083/api/v1/auth/userinfo`,
        headers:{
            'Authorization':'Bearer '+getToken()
        }
    })
}