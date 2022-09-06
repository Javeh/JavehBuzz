import React, { Component, useEffect } from "react";
import SettingsButton from './SettingsButton';
import './PassiveButton.css'

/**
 * Component that alerts if you click outside of it
 */
export default class OutsideAlerter extends Component {
    constructor(props) {
        super(props);

        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleSpacebar = this.handleSpacebar.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

        this.state = {
            color: "firebrick",
            active: false,
            locked: false,
            room: localStorage.getItem("room") == null ? "" : localStorage.getItem("room"),
            name: localStorage.getItem("name") == null ? "" : localStorage.getItem("name")
        };

    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        document.addEventListener("keydown", this.handleSpacebar)
        document.body.style = "background: " + (this.state.active ? "limegreen" : "firebrick");

        /*
   
            const interval = setInterval(() => {


                const requestOptions = {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: this.state.name,
                        room: this.state.room
                    })
                };
                fetch(window.location.origin + "/api/rooms/" +  this.state.room, requestOptions)

            }, 1000);
*/
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
        document.removeEventListener("keydown", this.handleSpacebar)

    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        //if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
        if (this.state.locked) {
            return;
        }
        if (this.wrapperRef && event.target == "[object HTMLHtmlElement]") {  //eslint-disable-line
            this.setState({
                active: !this.state.active
            }
            )
            document.body.style = "background: " + (this.state.active ? "firebrick" : "limegreen");

        }
    }
    handleSpacebar(event) {
        if (this.state.locked) {
            return;
        }
        if (event.keyCode === 32 && document.activeElement.nodeName.toLowerCase() !== "input") {
            this.setState({
                active: !this.state.active
            }
            )
            document.body.style = "background: " + (this.state.active ? "firebrick" : "limegreen");
        }
    }

    handleEdit(name, room){
        this.setState({
            name: name,
            room: room
        });
    }



    render() {

        return <div className="Buzzer" ref={this.wrapperRef}>{this.props.children}
            <SettingsButton name = "" room = "" handleEdit = {this.handleEdit}></SettingsButton>

            <h1 className = "noselect">{this.state.name}</h1>
            <h1 className = "noselect">{this.state.room == null ||this.state.active.room == "" ? "" : "Room:"} {this.state.room}</h1>
        </div>;
    }
}