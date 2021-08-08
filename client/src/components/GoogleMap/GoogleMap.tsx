import React, { ChangeEvent, Component } from 'react';
import './GoogleMap.css';

interface GoogleMapState {
   
}

export default class GoogleMap extends Component<GoogleMapState, any> {

    constructor(props: any) {
        super(props);
        this.state = {
        };
    }

    private setLocation = (event: ChangeEvent<HTMLInputElement>) => {
        const googleLocation = event.target.value;
        this.setState({ googleLocation });
    }

    render() {
        return (
            <div id="map-container-google-1" className="z-depth-1-half map-container">
                <div className="search-location"><input className="search-destination" placeholder="Search destination" onChange={this.setLocation}/></div>
                <iframe src={"https://maps.google.com/maps?q="+this.state.googleLocation+"&t=&z=13&ie=UTF8&iwloc=&output=embed"
                }></iframe>
            </div>
        )
    }
}