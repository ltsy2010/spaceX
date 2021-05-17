import React, {Component} from 'react';
import { List, Avatar, Button, Checkbox, Spin } from 'antd';

//image
import satellite from "../assets/images/satellite.svg";

class SatelliteList extends Component {
    constructor(){
        super();
        this.state = {
            selected: [],
            isLoad: false
        };
    }

    //e: event
    //e.target can get datainfo
    onChange = e => {
        const { dataInfo, checked } = e.target;
        const { selected } = this.state;
        //add or remove satellite from selected array
        //return new selected array
        const list = this.addOrRemove(dataInfo, checked, selected);
        //update selected state
        this.setState({ selected: list })
    }

    addOrRemove = (item, status, list) => {
        //case1: check is true
        //  -> item not in the list - add into list
        //  ->item is in the list - do nothing
        //case2: check is false
        //  -> item not in the list - do nothing
        //  -> item is in the list - remove from list.

        //list has item? -> list.some(item=>item===10)
        //or use indexOf(3) -> if not exist, return -1.
        const found = list.some( entry => entry.satid === item.satid);

        if(status && !found){
            list.push(item)
        }

        if(!status && found){
            list = list.filter( entry => {
                return entry.satid !== item.satid;
            });
        }
        return list;
    }

    //call onshowMap from parent main, transfer selected to main.onshowmap
    onShowSatMap = () =>{
        this.props.onShowMap(this.state.selected);
    }

    render() {
        //satInfo from parent main.
        //above is an array data.
        //datasource from antd data cannot be null, [] if null.
        const satList = this.props.satInfo ? this.props.satInfo.above : [];
        const { isLoad } = this.props;
        const { selected } = this.state;

        //avatar is image
        //satname and launchdate are from satinfo
        //list items+ array[]
        //checkbox controlled: value + onchange
        //checkbox + datainfo defined by ourself ={item}
        //if loading ->spin
        //onclick: child->parent data communication
        return (
            <div className="sat-list-box">
                <Button className="sat-list-btn"
                        size="large"
                        disabled={ selected.length === 0}
                        onClick={this.onShowSatMap} >
                    Track on the map
                </Button>
                <hr/>

                {
                    isLoad ?
                        <div className="spin-box">
                            <Spin tip="Loading..." size="large" />
                        </div>
                        :
                        <List
                            className="sat-list"
                            itemLayout="horizontal"
                            size="small"
                            dataSource={satList}
                            renderItem={item => (
                                <List.Item
                                    actions={[<Checkbox dataInfo={item} onChange={this.onChange}/>]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar size={50} src={satellite} />}
                                        title={<p>{item.satname}</p>}
                                        description={`Launch Date: ${item.launchDate}`}
                                    />

                                </List.Item>
                            )}
                        />
                }
            </div>
        );
    }

}

export default SatelliteList;