import React, { Component, ChangeEvent } from 'react';
import './Register.css';
import axios from "axios";
import { NavLink } from 'react-router-dom';
import { UserRegisterDetails } from '../../models/UserRegisterDetails';
import { SuccessfulRegisterServerResponse } from '../../models/SuccessfulRegisterServerResponse';


interface registerState {
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    email: string
}

export default class Register extends Component<any, registerState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            userName: "",
            password: "",
            email: ""
        };
    }

    // a function that renders the firstName on the screen by updating its state
    private setFirstName = (event: ChangeEvent<HTMLInputElement>) => {
        const firstName = event.target.value;
        this.setState({ firstName });
    }

    // a function that renders the lastName on the screen by updating its state
    private setLastName = (event: ChangeEvent<HTMLInputElement>) => {
        const lastName = event.target.value;
        this.setState({ lastName });
    }

    // a function that renders the userName on the screen by updating its state
    private setUserName = (event: ChangeEvent<HTMLInputElement>) => {
        const userName = event.target.value;
        this.setState({ userName });
    }

    // a function that renders the password on the screen by updating its state
    private setPassword = (event: ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        this.setState({ password });
    }

    // a function that renders the email on the screen by updating its state
    private setEmail = (event: ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        this.setState({ email });
    }

    // function that set rules for register inputs value -- later use in onRegisterBtnClicked function
    private registerFeildsValidRules = () => {
        if (this.state.firstName.trim() === "" || this.state.lastName.trim() === "" || this.state.userName.trim() === "" || this.state.password.trim() === "" || this.state.email.trim() === "") {
            alert("All fields are required")
            return false;
        }
        if (this.state.firstName.length > 25 || this.state.lastName.length > 25 || this.state.userName.length > 25 || this.state.password.length > 25) {
            alert("Fields can include maximum of 25 characters")
            return false;
        }
        if (this.state.password.length < 5) {
            alert("Password must include minimum of 5 characters")
            return false;
        }
        if (!this.state.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,25}/g)) {
            alert("Email should be in this form: exemple@mail.com")
            return false;
        }
        return true;
    }

    // function that run the process of register
    private onRegisterBtnClicked = async () => {
        if (!this.registerFeildsValidRules()) {
            return;
        } else {
            try {
                // sending a post request with user register details to the server
                let userRegisterDetails = new UserRegisterDetails(this.state.firstName, this.state.lastName, this.state.userName, this.state.password, this.state.email);
                const response = await axios.post<SuccessfulRegisterServerResponse>("http://localhost:3001/users/register", userRegisterDetails);
                const serverResponse = response.data;
                axios.defaults.headers.common['Authorization'] = "Bearer " + serverResponse.token;
                alert("You got registered successfully");
                console.log("You got registered successfully");
                this.props.history.push('/login');
            }
            // catching errors from the server / registerFeildsValidRules and print it
            catch (error) {
                alert(error.response.data.error);
                console.log(error.response.status + ": " + error.response.data.error);
            }
        }
    }

    render() {
        return (
            <div className="register-container">
                <div className="row">
                    <div className="col-lg-4 col-md-2"></div>
                    <div className="col-lg-4 col-md-8 login-box">
                        <div className="col-lg-12 login-key">
                            <i className="fa fa-key"></i>
                        </div>
                        <div className="col-lg-12 login-title">
                            RESORT REGISTER
                        </div>
                        <div className="col-lg-12 login-form">
                            <div className="col-lg-12 login-form">
                                <div className="form-group">
                                    <input type="text" placeholder="FIRST NAME" className="form-control" value={this.state.firstName} onChange={this.setFirstName} />
                                </div>
                                <div className="form-group">
                                    <input type="text" placeholder="LAST NAME" className="form-control" value={this.state.lastName} onChange={this.setLastName} />
                                </div>
                                <div className="form-group">
                                    <input type="text" placeholder="USERNAME" className="form-control" value={this.state.userName} onChange={this.setUserName} />
                                </div>
                                <div className="form-group">
                                    <input type="password" placeholder="PASSWORD" className="form-control" value={this.state.password} onChange={this.setPassword} />
                                </div>
                                <div className="form-group">
                                    <input type="email" placeholder="EMAIL" className="form-control" value={this.state.email} onChange={this.setEmail} />
                                </div>
                                <div className="col-lg-12 login-btm login-button">
                                    <button type="submit" className="btn btn-outline-primary" onClick={this.onRegisterBtnClicked}>SIGN UP</button>
                                </div>
                                <div className="log-in"> Already have an account? <NavLink to="/login" exact>Sign-In</NavLink></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
