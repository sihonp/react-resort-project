import React, { Component } from 'react';
import './ClientNavbar.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';


export default class ClientNavbar extends Component{

    private onLogoutBtnClicked = () => {
        sessionStorage.clear()
        localStorage.clear()
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
            <Navbar.Brand>Sihon-Resorts</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                </Nav>
                <div><Button className="btn btn-info btn-md mr-2">Welcome <i className="fas fa-home" aria-hidden="true"></i> {sessionStorage.getItem("userName")}</Button></div><br></br>
                <div><Button href="/"  className="btn btn-danger btn-md" onClick={this.onLogoutBtnClicked}>Logout <i className="fas fa-sign-out-alt" aria-hidden="true"></i></Button></div>
            </Navbar.Collapse>
        </Navbar>
            
        )
    }
}
