import React, { Component } from 'react';
import './Admin.css';
import axios from "axios";
import { Resort } from '../../models/Resort';
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux';
import socketIOClient from "socket.io-client";
import AdminUpdateResort from '../AdminUpdateResort/AdminUpdateResort';
import { ActionType } from '../../redux/actionType';

interface AdminState {
    resorts: Resort[];
    show: boolean,
    close: boolean,
    animation: boolean,
    isUpdateModalOn: boolean,
}

export default class Admin extends Component<any, AdminState> {

    private socket: any
    unsubscribeStore: Unsubscribe;
    private url = "http://localhost:3001/"
    constructor(props: any) {
        super(props);
        this.state = {
            resorts: [],
            show: false,
            close: false,
            animation: false,
            isUpdateModalOn: store.getState().refreshModal
        };
        this.unsubscribeStore = store.subscribe(
            () => this.setState({
                isUpdateModalOn: store.getState().refreshModal
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
        axios.defaults.headers.common['Authorization'] = "Bearer " + sessionStorage.getItem("token");
        // admin is connected with the socketIO
        this.socket = socketIOClient('http://localhost:3002/', { query: "userId=" + sessionStorage.getItem("userName") }).connect(); // Client Socket Object.
        try {
            // gets the resorts from the server only if you have token
            if (sessionStorage.getItem("token") != null) {
                // sending a get request to get all resorts from admin
                const response = await axios({
                    method: 'get',
                    url: 'http://localhost:3001/users/admin/resorts',
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

                // generating sockets request that resort updated by admin
                this.socket.on('updateResort', (updateResort: any) => {
                    let newResorts = [...this.state.resorts];
                    let index = newResorts.map(function (searchedResort) {
                        return searchedResort.resortId;
                    }).indexOf(updateResort.resortId);
                    newResorts[index] = updateResort
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

    // function that get the image file name -- use this when deleting resort
    private getImageFileName = (id: number, resortsArray: Resort[]) => {
        let img
        for (let i = 0; i < resortsArray.length; i++) {
            if (resortsArray[i].resortId === id) {
                img = resortsArray[i].resortImg
            }
        }
        return img
    }

    // function that delete resort by admin
    private onDeleteClicked = async (id: number) => {
        const resortToRemove = id;
        const resortsArray = this.state.resorts.slice()
        const imgFileToRemoveFromUploads = this.getImageFileName(id, resortsArray)
        let filteredResortsArray = resortsArray.filter(resort => resort.resortId !== id)
        store.dispatch({ type: ActionType.updateResortsArray, payload: filteredResortsArray });

        if (window.confirm("Do you want Delete") === false) {
            return false;
        } else {
            // sending a delete request to server to get resort deleted by admin
            axios({
                method: 'delete',
                url: 'http://localhost:3001/users/admin/delete',
                data: {
                    resortId: resortToRemove,
                    imgFileToRemove: imgFileToRemoveFromUploads,
                }
            })
            this.setState({ resorts: filteredResortsArray })
            this.socket.emit("deleteResort", resortToRemove);
        }
    };

    // function that update resort by admin
    private onUpdateClicked = (resort: Resort) => {
        //clear the modal fields evry time it open 
        store.dispatch({ type: ActionType.refreshModal, payload: false });
        // insert the update resort value into the modal -- update modal in diffrent components
        store.dispatch({ type: ActionType.sendResort, payload: resort });
    }

    render() {
        return (
            <div className="row">
                {this.state.resorts.map(resort =>
                    <div className="column" key={resort.resortId}>
                        <div className="card" >
                            <img className="card-img" src={this.url + resort.resortImg} alt="resort" />
                            <div className="editBtn">
                                <i className="far fa-edit fa-lg" onClick={() => this.onUpdateClicked(resort)}></i>
                            </div>
                            <div className="deleteBtn" onClick={() => this.onDeleteClicked(resort.resortId)}><i className="fas fa-trash-alt fa-lg"></i></div>
                            <div className="card-body">
                                <h4 className="card-title">{resort.resortName}</h4>
                                <h6 className="card-subtitle mb-2 text-muted">Check In {resort.resortStartDate}</h6>
                                <h6 className="card-subtitle mb-2 text-muted">Check Out {resort.resortEndDate}</h6>
                                <p className="card-text">{resort.resortInfo}</p>
                                <div className="buy d-flex justify-content-between align-items-center">
                                    <div className="price text-success"><h5 className="mt-4">${resort.resortPrice}</h5></div>
                                    <div className="followers-box"><span>{resort.count} </span> Followers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {this.state.isUpdateModalOn && <AdminUpdateResort />}
            </div>
        )
    }
}
