import React, { Component } from 'react';
import './AdminNavbar.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Unsubscribe } from "redux";
import { store } from '../../redux/store';
import AdminAddResort from '../AdminAddResort/AdminAddResort';
import AdminResortChart from '../AdminResortChart/AdminResortChart';
import socketIOClient from "socket.io-client";
import axios from "axios";
import { Resort } from '../../models/Resort';

interface AdminNavbarState {
    resorts: Resort[],
    chartData: any,
}

export default class AdminNavbar extends Component<any, AdminNavbarState>{

    private socket: any
    private unsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props);
        this.state = {
            resorts: [],
            chartData: {}
        };

        this.unsubscribeStore = store.subscribe(
            () => this.setState({
                resorts: store.getState().resorts
            })
        )
    }


    public componentWillUnmount() {
        this.unsubscribeStore()
        this.setState = (state, callback) => {
            return;
        };

    }

    public componentDidMount = async () => {
        this.socket = socketIOClient('http://localhost:3002/', { query: "userId=" + sessionStorage.getItem("userName") }).connect();
        const response = await axios({
            method: 'post',
            url: 'http://localhost:3001/users/Dashboard/chart',
            data: {

            }
        })

        let followedResort = response.data
        let resort = []
        let followers = []
        for (let index = 0; index < followedResort.length; index++) {
            if (followedResort[index].count !== 0) {
                resort.push(followedResort[index].resortName);
                followers.push(followedResort[index].count);
            }
        }
        let newState = { ...this.state };
        newState.chartData = { resort: resort, followers: followers }
        this.setState({ chartData: newState.chartData })

        this.registerSocketListeners();
    }

    private registerSocketListeners = () => {
        this.socket.on('followResort', (followResortUpdateData: any) => {
            let newResorts = { ...this.state.chartData }
            if (newResorts.resort.includes(followResortUpdateData.resortName)) {
                let index = newResorts.resort.indexOf(followResortUpdateData.resortName);
                newResorts.followers[index] = newResorts.followers[index] + 1
            } else {
                newResorts.resort.push(followResortUpdateData.resortName);
                newResorts.followers.push(1);
            }

            this.setState({ chartData: newResorts })
        });


        this.socket.on('unFollowResort', (unFollowedResorts: any) => {
            let newResorts = { ...this.state.chartData }
            let index = newResorts.resort.indexOf(unFollowedResorts.resortName);

            if (newResorts.followers[index] === 1) {
                newResorts.followers.splice(index, 1);
                newResorts.resort.splice(index, 1);
            } else if (newResorts.followers[index] > 1) {
                newResorts.followers[index] = newResorts.followers[index] - 1;
            }

            this.setState({ chartData: newResorts })
        });
    }

    private onLogoutBtnClicked = () => {
        sessionStorage.clear()
        localStorage.clear()
    }


    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand>Resorts Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto btn-sm">
                        <div className="mr-2"><AdminAddResort /></div><br />
                        <div className="mr-2">{Object.keys(this.state.chartData).length > 0 && <AdminResortChart chartData={this.state.chartData} />}</div>
                    </Nav><br />
                    <div><Button className="btn btn-info btn-md mr-2">Welcome <i className="fas fa-home" aria-hidden="true"></i> {sessionStorage.getItem("userName")}</Button></div><br></br>
                    <div><Button className="btn btn-danger btn-md" href="/" onClick={this.onLogoutBtnClicked}>Logout <i className="fas fa-sign-out-alt" aria-hidden="true"></i></Button></div>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
