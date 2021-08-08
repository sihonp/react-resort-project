import React, { Component } from 'react';
import './AdminResortChart.css';
import { Bar } from 'react-chartjs-2';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface AdminResortChartState {
    show: boolean;
    chartData: any,
}

export default class AdminResortChart extends Component<any, AdminResortChartState> {

    constructor(props: any) {
        super(props);
        this.state = {
            show: false,
            chartData: props.chartData
        };
    }

    render() {
        return (
            <div>
                <div>
                    <Button className="btn btn-primary btn-md" onClick={() => this.setState({ show: true })}>
                        <span className="add-resort"><i className="fa fa-bar-chart" aria-hidden="true"> </i> Chart</span>
                    </Button>
                </div>
                <Modal backdrop="static"
                    keyboard={false} show={this.state.show}>
                    <div className="chart">
                        <Bar redraw
                            data={{
                                labels: this.state.chartData.resort,
                                datasets: [{
                                    data: this.state.chartData.followers,
                                    label: 'No. of Followers',
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.6)',
                                        'rgba(54, 162, 235, 0.6)',
                                        'rgba(255, 206, 86, 0.6)',
                                        'rgba(75, 192, 192, 0.6)',
                                        'rgba(153, 102, 255, 0.6)',
                                        'rgba(255, 159, 64, 0.6)',
                                        'rgba(255, 99, 132, 0.6)'
                                    ]
                                }]
                            }}
                            width={250}
                            height={200}
                            options={{
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                            beginAtZero: true,
                                            min: 0,
                                            stepSize: 1
                                        }
                                    }]
                                }, responsive: true
                            }}
                        />
                    </div>
                    <Modal.Footer className="py-1 d-flex justify-content-center">
                        <div>
                            <Button variant="outline-dark" onClick={() => this.setState({ show: false })}>Close</Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
