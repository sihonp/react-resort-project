import React, { Component, ChangeEvent } from 'react';
import './Login.css';
import axios from "axios";
import { NavLink } from 'react-router-dom';
import { UserLoginDetails } from '../../models/UserLoginDetails';
import { SuccessfulLoginServerResponse } from '../../models/SuccessfulLoginServerResponse';


interface LoginState {
    userName: string,
    password: string,
}

export default class Login extends Component<any, LoginState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            userName: "",
            password: "",
        };
    }

    // function that renders the userName on the screen by updating its state
    private setUserName = (event: ChangeEvent<HTMLInputElement>) => {
        const userName = event.target.value;
        this.setState({ userName });
    }

    // function that renders the password on the screen by updating its state
    private setPassword = (event: ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        this.setState({ password });

    }

    // function that set rules for login inputs value -- later use in onLoginBtnClicked function
    private loginFeildsValidRules = () => {
        if (this.state.userName.trim() === "" || this.state.password.trim() === "") {
            alert("All fields are required")
            return false;
        }
        if (this.state.password.length < 5) {
            alert("Password must include minimum of 5 characters")
            return false;
        }
        return true;
    }

    // function that check what is the userType and update the routing to admin or client page 
    private checkIfUserIsAdminOrClient = (serverResponse: any) => {
        if (serverResponse.userType === "Admin") {
            this.props.history.push('/admin')
            sessionStorage.setItem("userType", "Admin");

        }
        else if (serverResponse.userType === "Client") {
            this.props.history.push('/client')
            sessionStorage.setItem("userType", "Client");
        }
    }

    // function that run the process of login 
    private onLoginBtnClicked = async () => {
        if (!this.loginFeildsValidRules()) {
            return;
        } else {
            try {
                // sending a post request with user login details in order to get access to the website
                let userLoginDetails = new UserLoginDetails(this.state.userName, this.state.password);
                const response = await axios.post<SuccessfulLoginServerResponse>("http://localhost:3001/users/login", userLoginDetails);
                const serverResponse = response.data;

                axios.defaults.headers.common['Authorization'] = "Bearer " + serverResponse.token;
                sessionStorage.setItem("token", serverResponse.token);
                sessionStorage.setItem("userName", this.state.userName);

                this.checkIfUserIsAdminOrClient(serverResponse);
            }
            // catching errors from the server / loginFeildsValidRules and print it
            catch (error) {
                alert(error.response.data.error)
                console.log(error.response.status + ": " + error.response.data.error);
            }
        }
    }

    // rendering the login form
    render() {
        return (
            <div className="login-container">
                <div className="row">
                    <div className="col-lg-4 col-md-2"></div>
                    <div className="col-lg-4 col-md-8 login-box">
                        <div className="col-lg-12 login-key">
                            <i className="fa fa-key"></i>
                        </div>
                        <div className="col-lg-12 login-title">
                            RESORT LOGIN
                        </div>
                        <div className="col-lg-12 login-form">
                            <div className="col-lg-12 login-form">
                                <div className="form-group">
                                    <input placeholder="USERNAME" type="text" className="form-control" value={this.state.userName} onChange={this.setUserName} />
                                </div>
                                <div className="form-group">
                                    <input placeholder="PASSWORD" type="password" className="form-control" value={this.state.password} onChange={this.setPassword} />
                                </div>
                                <div className="col-lg-12 login-btm login-button">
                                    <button type="submit" className="btn btn-outline-primary" onClick={this.onLoginBtnClicked}>LOGIN</button>
                                </div>
                                <div className="sign-up"> Don't have an account? <NavLink to="/register" exact>Create one</NavLink></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
