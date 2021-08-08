import React, { Component } from 'react';
import './Client.css';
import axios from "axios";
import { Resort } from '../../models/Resort';
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux';
import socketIOClient from 'socket.io-client';
import ClientWelcomeNote from '../ClientWelcomeNote/ClientWelcomeNote';
import GoogleMap from '../GoogleMap/GoogleMap';

interface ClientState {
    resorts: Resort[],
    follow: Resort[],
    followResortArray: Resort[],
}

export default class Client extends Component<any, ClientState> {

    private unsubscribeStore: Unsubscribe
    private socket: any
    private url = "http://localhost:3001/"
    constructor(props: any) {
        super(props);
        this.state = {
            resorts: [],
            follow: [],
            followResortArray: [],
        };

        this.unsubscribeStore = store.subscribe(
            () => this.setState({
                resorts: store.getState().resorts
            })
        )
    };

    public componentWillUnmount() {
        this.unsubscribeStore()
        this.setState = (state, callback) => {
            return;
        };
    }

    public componentDidMount = async () => {
        axios.defaults.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem("token");
        // client is connected with the socketIO
        this.socket = socketIOClient('http://localhost:3002/', { query: "userId=" + sessionStorage.getItem("userName") }).connect();
        try {
            // gets the resorts from the server only if you have token
            if (sessionStorage.getItem("token") != null) {
                // sending a get request to server to get all resort by client
                const response = await axios({
                    method: 'get',
                    url: 'http://localhost:3001/users/client/resorts',
                    data: {

                    }
                })

                let newState = [...this.state.resorts];
                newState = response.data
                this.setState({ resorts: newState })

                // generating sockets request that resort added by admin
                this.socket.on('addResort', (addResort: any) => {
                    let newResorts = [...this.state.resorts]
                    newResorts.push(addResort)
                    this.setState({ resorts: newResorts })
                })

                // generating sockets request that resort deleted by admin
                this.socket.on('deleteResort', (deleteResort: any) => {
                    let newResorts = [...this.state.resorts]
                    let index = newResorts.map(function (searchedResort) {
                        return searchedResort.resortId;
                    }).indexOf(deleteResort.resortId);
                    newResorts.splice(index, 1);

                    this.setState({ resorts: newResorts })
                })

                // generating sockets request that resort updated by admin
                this.socket.on('updateResort', (updateResort: any) => {
                    let newResorts = [...this.state.resorts];
                    let index = newResorts.map(function (searchedResort) {
                        return searchedResort.resortId;
                    }).indexOf(updateResort.resortId);
                    newResorts[index] = updateResort
                    this.setState({ resorts: newResorts })
                });

                // generating sockets request that client follow resort to admin and other users
                this.socket.on('followResort', (followResortUpdateData: any) => {
                    let newResorts = [...this.state.resorts]
                    let index = newResorts.map(function (searchedResort) {
                        return searchedResort.resortId;
                    }).indexOf(followResortUpdateData.resortId);
                    newResorts[index].count++;
                    this.setState({ resorts: newResorts })
                });

                // generating sockets request that client unfollow resort to admin and other users
                this.socket.on('unFollowResort', (unFollowResortUpdateData: any) => {
                    let newResorts = [...this.state.resorts]
                    let index = newResorts.map(function (searchedResort) {
                        return searchedResort.resortId;
                    }).indexOf(unFollowResortUpdateData.resortId);
                    newResorts[index].count--;
                    this.setState({ resorts: newResorts })
                });
            } else {
                this.props.history.push('/login');
                return;
            }
        } catch (error) {
            this.props.history.push('/login')
            console.log(error.response.status + ": " + error.response.data.error);

        }
    }

    // function that set the resort order from highest followers to the lowest
    private order = (a: Resort, b: Resort) => {
        if (a.followBtn > b.followBtn) {
            return -1;
        } else if (a.followBtn < b.followBtn) {
            return 1;
        } else {
            return 0;
        }
    }

    // function that do the follow resort -- sending a post request with the clicked resorts ID
    private followResort = (resort: Resort) => {
        if (resort.followBtn === false) {
            // sending a post request to server to follow a resort by client
            axios({
                method: 'post',
                url: 'http://localhost:3001/users/client/follow',
                data: {
                    resortId: resort.resortId,
                }
            });

            let newResorts = [...this.state.resorts]
            let index = newResorts.map(function (searchedResort) {
                return searchedResort.resortId;
            }).indexOf(resort.resortId);
            newResorts[index].followBtn = true
            newResorts[index].count = (newResorts[index].count) + 1

            this.setState({ resorts: newResorts })
            this.socket.emit("followResort", resort);
        }
        else {
            this.unfollowResort(resort);
        }
    }

    // function that do the unfollow 
    private unfollowResort = (resort: Resort) => {
        // sending a delete request to server to unfollow a resort by client
        axios({
            method: 'delete',
            url: 'http://localhost:3001/users/client/unfollow',
            data: {
                resortId: resort.resortId,
            }
        })

        let newResorts = [...this.state.resorts]
        let index = newResorts.map(function (vacationToFind) {
            return vacationToFind.resortId;
        }).indexOf(resort.resortId);
        newResorts[index].followBtn = false
        newResorts[index].count = (newResorts[index].count) - 1
        this.setState({ resorts: newResorts })

        this.socket.emit("unFollowResort", resort);
    }

    render() {
        return (
            <div >
                <div className="welcome-note">
                    <ClientWelcomeNote />
                </div>
                <div className="row" >
                    {this.state.resorts.sort((a, b) => this.order(a, b)).map(resort =>
                        <div className="column" key={resort.resortId}>
                            <div className="card" >
                                <img className="card-img" src={this.url + resort.resortImg} alt="resort" />
                                <div className={((resort.followBtn === true) ? "follow-btn" : "unFollow-btn")} onClick={() => this.followResort(resort)} >
                                    <i className="fas fa-heart fa-lg"></i>
                                </div>
                                <div className="card-body">
                                    <h4 className="card-title">{resort.resortName}</h4>
                                    <h6 className="card-subtitle mb-2 text-muted">Check In {resort.resortStartDate}</h6>
                                    <h6 className="card-subtitle mb-2 text-muted">Check Out {resort.resortEndDate}</h6>
                                    <p className="card-text">{resort.resortInfo}</p>
                                    <div className="card-bottom">
                                        <div className="card-price"><h5>${resort.resortPrice}</h5></div>
                                        <div className="followers-box"><span>{resort.count}</span> Followers</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                    }
                </div>
                <div className="GoogleMap-search">
                    <GoogleMap />
                </div>
            </div>
        )
    }
}