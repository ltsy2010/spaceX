import React, {Component} from 'react';
import { Row, Col } from 'antd';
import axios from 'axios';
import SatSetting from "./SatSetting";
import SatelliteList from './SatelliteList';
import WorldMap from './WorldMap';
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";

class Main extends Component {
    constructor() {
        super();
        this.state = {
            satInfo: null,
            satList: null,
            setting: null,
            isLoadingList: false
        };
    }

    showNearbySatellite = (setting) => {
        //setState setting
        //fetch satellite data
        this.setState({
            isLoadingList: true,
            setting: setting
        })

        this.fetchSatellite(setting);
    }

    fetchSatellite = (setting) => {
        //get satellite parameter for APIs
        const {latitude, longitude, elevation, altitude} = setting;
        //url stringp拼接反引号. from N2yo.com request.
        //you dont have to use /api prefix.
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}/&apiKey=${SAT_API_KEY}`;

        //when加载, set = ture
        this.setState({
            isLoadingList: true
        });

        //make request. axios is based on promise. used in industry.
        //.then receive response.only need data in response.
        axios.get(url)
            .then(response => {
                console.log(response.data)
                //setState for satellitelist.list get latest data after setstate.
                this.setState({
                    satInfo: response.data,
                    isLoadingList: false
                })
            })
            .catch(error => {
                console.log('err in fetch satellite -> ', error);
            })
    }

    //setState -> rerender
    //copy selected to satlist.
    showMap = (selected) => {
       // console.log('show on the map')
        this.setState(preState => ({
            ...preState,
            satList: [...selected]
        }))

    }
   //satsetting -> parent main by onshow
    //onshowmap send to main
    render() {
        const {isLoadingList, satInfo, satList, setting} = this.state;
        return (
            <Row className="main">
                <Col span={8} className="left-side">
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList
                        satInfo={satInfo} //parent to child data comm
                        isLoad={this.state.isLoadingList}
                        onShowMap={this.showMap}
                    />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={setting} />
                </Col>
            </Row>
        );
    }

}
export default Main;
