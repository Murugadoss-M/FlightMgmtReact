const logOut=(props)=>{

    localStorage.clear();
    props.history.goBack();

}

export default logOut;