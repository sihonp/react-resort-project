import React, { ChangeEvent, Component } from 'react';
import './AdminUpdateResort.css';
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import socketIOClient from 'socket.io-client';
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux';
import { ActionType } from '../../redux/actionType';
import moment from 'moment';

interface AdminUpdateResortState {
    show: boolean,
    close: boolean,
    preview: string,
    resortId: number,
    resortName: string,
    resortPrice: number,
    resortInfo: string,
    resortStartDate: string,
    resortEndDate: string,
    isUpdateModalOn: boolean,
    resortImage?: File,
    resortImg: string,
    resortUploadImage?: string,
    count: number,
}

export default class AdminUpdateResort extends Component<any, AdminUpdateResortState> {
    private fileInput: HTMLInputElement;
    private url = "http://localhost:3001/"
    private minDate = moment().format('YYYY-MM-DD')
    private socket: any
    private unsubscribeStore: Unsubscribe;
    constructor(props: any) {
        super(props);
        this.state = {
            show: true,
            close: false,
            preview: this.url + store.getState().sendResort.resortImg,
            resortId: store.getState().sendResort.resortId,
            resortName: store.getState().sendResort.resortName,
            resortPrice: store.getState().sendResort.resortPrice,
            resortInfo: store.getState().sendResort.resortInfo,
            resortStartDate: store.getState().sendResort.resortStartDate,
            resortEndDate: store.getState().sendResort.resortEndDate,
            isUpdateModalOn: store.getState().refreshModal,
            resortImg: store.getState().sendResort.resortImg,
            count: store.getState().sendResort.count,
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
        this.socket = socketIOClient('http://localhost:3002/', { query: "userId=" + sessionStorage.getItem("userName") }).connect();
    }

    private setResortName = (event: ChangeEvent<HTMLInputElement>) => {
        const resortName = event.target.value;
        this.setState({ resortName });
    }
    private setResortPrice = (event: ChangeEvent<HTMLInputElement>) => {
        const resortPrice = +event.target.value;
        this.setState({ resortPrice });
    }
    private setResortInfo = (event: ChangeEvent<HTMLInputElement>) => {
        const resortInfo = event.target.value;
        this.setState({ resortInfo });
    }
    private setResortStartDate = (event: ChangeEvent<HTMLInputElement>) => {
        const resortStartDate = event.target.value;
        this.setState({ resortStartDate });
    }
    private setResortEndDate = (event: ChangeEvent<HTMLInputElement>) => {
        const resortEndDate = event.target.value;
        this.setState({ resortEndDate });
    }
    private setResortImage = (event: ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files[0];
        const resortImage = image;
        this.setState({ resortImage });
        var reader = new FileReader();
        reader.onload = event => this.setState({ preview: event.target.result.toString() });
        reader.readAsDataURL(image);
    }

    private updateResortClicked = async () => {
        if (!this.isUpdateFormFieldsValid()) {
            return false;
        } else {
            const myFormData = new FormData();
            let resortImageValue;
            if (this.state.resortImage === undefined) {
                resortImageValue = this.state.resortImg
            }
            myFormData.append("resortId", this.state.resortId.toString());
            myFormData.append("resortName", this.state.resortName);
            myFormData.append("resortPrice", this.state.resortPrice.toString());
            myFormData.append("resortInfo", this.state.resortInfo);
            myFormData.append("resortStartDate", this.state.resortStartDate);
            myFormData.append("resortEndDate", this.state.resortEndDate);
            myFormData.append("imageFile", this.state.resortImage);
            myFormData.append("sameImageName", resortImageValue);
            myFormData.forEach((value, key) => {
                console.log("key %s: value %s", key, value);
            })
            // sending a post request with resort details to the server
            const response = await axios({
                method: 'put',
                url: 'http://localhost:3001/users/admin/updateResort',
                data: myFormData
            })
            store.dispatch({ type: ActionType.refreshModal, payload: this.state.isUpdateModalOn });
            this.sendUpdatedResortToSocket(response.data)
            let newState = { ...this.state }
            newState.show = false;
            this.setState(newState)
        }
    }

    private sendUpdatedResortToSocket = (resortImageValue: any) => {
        let data = {
            resortId: this.state.resortId,
            resortName: this.state.resortName,
            resortPrice: this.state.resortPrice,
            resortInfo: this.state.resortInfo,
            resortImg: resortImageValue,
            resortStartDate: this.state.resortStartDate,
            resortEndDate: this.state.resortEndDate,
            count: this.state.count,
        }
        this.socket.emit("updateResort", data);;
    }

    private isUpdateFormFieldsValid = () => {
        if (this.state.resortName.trim() === "" || this.state.resortPrice === +"" || this.state.resortInfo.trim() === "") {
            alert("All fields are required")
            return false;
        }

        if (this.state.resortPrice <= 0 || isNaN(this.state.resortPrice)) {
            alert("Please enter a price that is greater the 0")
            return false
        }

        if (this.state.resortImg === undefined) {
            alert("Please add an image")
            return false;
        }

        if (Date.parse(this.state.resortStartDate) >= Date.parse(this.state.resortEndDate)) {
            alert("Wrong date please check your input and try again")
            return false;
        }
        return true;
    }

    private clearResortFromModal = () => {
        let newState = { ...this.state }
        newState.show = false;
        this.setState(newState)
        store.dispatch({ type: ActionType.refreshModal, payload: this.state.isUpdateModalOn });
    }

    render() {
        return (
            <div>
                <Modal backdrop="static"
                    keyboard={false}
                    show={this.state.show}>
                    <Modal.Header className="primary">
                        <Modal.Title className="text-center">Update Resort</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="py-0 border">
                        <br></br>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Resort Name</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl value={this.state.resortName} onChange={this.setResortName} aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                        </InputGroup>
                        <br></br>
                        <input id="add-image" type="file" value={this.state.resortUploadImage || ""} onChange={this.setResortImage} accept="image/*" ref={fi => this.fileInput = fi} />
                        <Button variant="primary" id="add-image-btn" type="button" onClick={() => this.fileInput.click()}>Select Resort Image</Button>
                        <br></br>
                        <br></br>
                        <img className="update-image" alt="resort" src={this.state.preview} />
                        <button id="add-image" type="button">Add Product</button>
                        <br></br>
                        <br></br>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">$</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl value={this.state.resortPrice} onChange={this.setResortPrice} aria-label="Amount (to the nearest dollar)" />
                            <InputGroup.Append>
                                <InputGroup.Text id="inputGroup-sizing-default">.00</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>

                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Resort Details</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl placeholder='No more than 215 characters' maxLength={215} value={this.state.resortInfo} onChange={this.setResortInfo} as="textarea" aria-label="With textarea" />
                        </InputGroup>
                        <br></br>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Check In</InputGroup.Text>
                            </InputGroup.Prepend ><input min={this.minDate} className="fileds" type="date" value={this.state.resortStartDate} onChange={this.setResortStartDate} />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Check Out</InputGroup.Text>
                            </InputGroup.Prepend ><input min={this.state.resortStartDate || this.minDate} className="fileds" type="date" value={this.state.resortEndDate} onChange={this.setResortEndDate} />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer className="py-1 d-flex justify-content-center">
                        <div>
                            <Button variant="danger" onClick={this.clearResortFromModal}>Cancel</Button>
                        </div>
                        <div>
                            <Button variant="success" onClick={this.updateResortClicked} className="mx-2 px-3">Save</Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div >
        )
    }
}
