import React, { Component, ChangeEvent } from "react";
import './AdminAddResort.css';
import axios, { AxiosResponse } from "axios";
import socketIOClient from 'socket.io-client';
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import moment from 'moment';

interface AdminAddResortState {
    show: boolean,
    close: boolean,
    preview: string,
    resortName: string,
    resortPrice: number,
    resortImage: string,
    resortInfo: string,
    resortStartDate: any,
    resortEndDate: any,
    resortImg?: File,
}

export default class AdminAddResort extends Component<any, AdminAddResortState> {

    private fileInput: HTMLInputElement;
    private socket: any
    private minDate = moment().format('YYYY-MM-DD')
    constructor(props: any) {
        super(props);
        this.state = {
            show: false,
            close: false,
            preview: '',
            resortName: '',
            resortPrice: 0,
            resortImage: '',
            resortInfo: '',
            resortStartDate: new Date(),
            resortEndDate: new Date(),
        };
    }

    public componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        };

    }

    public componentDidMount = async () => {
        this.socket = socketIOClient('http://localhost:3002/', { query: "userId=" + sessionStorage.getItem("userName") }).connect();
    }

    // function that renders the resortName on the screen by updating its state
    private setResortName = (event: ChangeEvent<HTMLInputElement>) => {
        const resortName = event.target.value;
        this.setState({ resortName });
    }

    // function that renders the resortPrice on the screen by updating its state
    private setResortPrice = (event: ChangeEvent<HTMLInputElement>) => {
        const resortPrice = +event.target.value;
        this.setState({ resortPrice });
    }

    // function that renders the resortInfo on the screen by updating its state
    private setResortInfo = (event: ChangeEvent<HTMLInputElement>) => {
        const resortInfo = event.target.value;
        this.setState({ resortInfo });
    }

    // function that renders the resortStartDate on the screen by updating its state
    private setResortStartDate = (event: ChangeEvent<HTMLInputElement>) => {
        const resortStartDate = event.target.value;
        this.setState({ resortStartDate });
    }

    // function that renders the resortEndDate on the screen by updating its state
    private setResortEndDate = (event: ChangeEvent<HTMLInputElement>) => {
        const resortEndDate = event.target.value;
        this.setState({ resortEndDate });
    }

    // function that renders the resortImg on the screen by updating its state
    private setResortImg = (event: ChangeEvent<HTMLInputElement>) => {
        const image = event.target.files[0];
        const resortImg = image;
        this.setState({ resortImg });
        var reader = new FileReader();
        reader.onload = event => this.setState({ preview: event.target.result.toString() });
        reader.readAsDataURL(image);
    }

    // function that set rules for adding resort inputs value -- later use in addResortClicked function
    private isAddingFormFieldsValid = () => {

        if (this.state.resortName.trim() === "" || this.state.resortInfo.trim() === "") {
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

  
    private sendResortToSocket = (response: AxiosResponse<any>) => {
        let data = {
            resortId: response.data.resortLastId[0].max,
            resortName: this.state.resortName,
            resortPrice: this.state.resortPrice,
            resortInfo: this.state.resortInfo,
            resortImg: response.data.imgNameInServer,
            resortStartDate: this.state.resortStartDate,
            resortEndDate: this.state.resortEndDate,
            count: 0,
        }
        this.socket.emit("addResort", data);; 
    }

    // function that adding a new resort
    private addResortClicked = async () => {
        if (!this.isAddingFormFieldsValid()) {
            return;
        } else {
            const myFormData = new FormData();
            myFormData.append("resortName", this.state.resortName);
            myFormData.append("resortPrice", this.state.resortPrice.toString());
            myFormData.append("resortInfo", this.state.resortInfo);
            myFormData.append("resortStartDate", this.state.resortStartDate);
            myFormData.append("resortEndDate", this.state.resortEndDate);
            myFormData.append("count", "0");
            myFormData.append("image", this.state.resortImg, this.state.resortImg.name);
            myFormData.forEach((value, key) => {
                console.log("key %s: value %s", key, value);
            })
            // sending a post request with resort details to the server
            const response = await axios({
                method: 'post',
                url: 'http://localhost:3001/users/admin/addResort',
                data: myFormData
            })
            this.sendResortToSocket(response)
            this.clearResortFromModal();
        }
    }

    private clearResortFromModal = () => {
        let newState = { ...this.state }
        newState.resortName = "";
        newState.resortPrice = 0;
        newState.resortInfo = "";
        newState.resortStartDate = undefined;
        newState.resortEndDate = undefined;
        newState.preview = undefined;
        newState.show = false;
        this.setState(newState)
    }

    render() {
        return (
            <div>
                <Button className="btn btn-primary btn-md" onClick={() => this.setState({ show: true })}>
                    <span className="add-resort"><i className="fas fa-umbrella-beach" aria-hidden="true"></i> Add Resort</span>
                </Button>
                <Modal backdrop="static"
                    keyboard={false}
                    show={this.state.show}>
                    <Modal.Header className="primary">
                        <Modal.Title className="text-center">Add Resort</Modal.Title>
                    </Modal.Header>
                    <br></br>
                    <Modal.Body className="py-0 border">
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Resort Name</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl value={this.state.resortName || ""} onChange={this.setResortName} aria-label="Default" aria-describedby="inputGroup-sizing-default" />
                        </InputGroup>
                        <input id="add-image" type="file" value={this.state.resortImage || ""} onChange={this.setResortImg} accept="image/*" ref={fi => this.fileInput = fi} />
                        <Button variant="primary" id="add-image-btn" type="button" onClick={() => this.fileInput.click()}>Select Resort Image</Button>
                        <br></br>
                        <br></br>
                        <img alt="" className="modal-image" src={this.state.preview} />
                        <button id="add-image" type="button" >Add Product</button>
                        <br></br>
                        <br></br>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">$</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl value={this.state.resortPrice || ""} onChange={this.setResortPrice} aria-label="Amount (to the nearest dollar)" />
                            <InputGroup.Append>
                                <InputGroup.Text id="inputGroup-sizing-default">.00</InputGroup.Text>
                            </InputGroup.Append>
                        </InputGroup>
                        <br></br>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Resort Details</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl placeholder='No more than 215 characters' maxLength={215} value={this.state.resortInfo || ""} onChange={this.setResortInfo} as="textarea" aria-label="With textarea" />
                        </InputGroup>
                        <br></br>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Check In</InputGroup.Text>
                            </InputGroup.Prepend ><input min={this.minDate} className="fileds" type="date" value={this.state.resortStartDate || ""} onChange={this.setResortStartDate} />
                        </InputGroup>
                        <br></br>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Check Out</InputGroup.Text>
                            </InputGroup.Prepend ><input min={this.state.resortStartDate || this.minDate} className="fileds" type="date" value={this.state.resortEndDate || ""} onChange={this.setResortEndDate} />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer className="py-1 d-flex justify-content-center">
                        <div>
                            <Button variant="danger" onClick={this.clearResortFromModal}>Cancel</Button>
                        </div>
                        <div>
                            <Button variant="success" onClick={this.addResortClicked} className="mx-2 px-3">Save</Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}