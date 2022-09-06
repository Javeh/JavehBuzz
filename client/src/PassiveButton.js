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
        this.handleBuzz = this.handleBuzz.bind(this);

        
        this.state = {
            color: "firebrick",
            active: false,
            locked: false,
            room: localStorage.getItem("room") == null ? "" : localStorage.getItem("room"),
            name: localStorage.getItem("name") == null ? "" : localStorage.getItem("name"),
            enabled: false
        };
        const interval = setInterval(() => {
            if(!this.state.enabled){
                return;
            }

            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            };
            console.log(window.location.origin + "/api/rooms/" +  this.state.room);
            fetch(window.location.origin + "/api/rooms/" +  this.state.room, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    active: data['locked']
                });
                document.body.style = "background: " + (this.state.active ? "limegreen" : "firebrick");

            });

        }, 200);

    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        document.addEventListener("keydown", this.handleSpacebar)
        document.body.style = "background: " + (this.state.active ? "limegreen" : "firebrick");

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
            this.handleBuzz();

        }
    }
    handleSpacebar(event) {
        if (this.state.locked) {
            return;
        }
        if (event.keyCode === 32 && document.activeElement.nodeName.toLowerCase() !== "input") {
            
            this.handleBuzz();
        }
    }

    handleEdit(name, room){
        this.setState({
            name: name,
            room: room,
            enabled: true
        });
           
    }

    handleBuzz(){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: this.state.name,
                room: this.state.room
            })
        };
        fetch(window.location.origin + "/api/buzz", requestOptions)
        .then(response => response.json())
        .then(data => {
            this.setState({
                active: data['buzzed']
            })
            document.body.style = "background: " + (this.state.active ? "limegreen" : "firebrick");
        })


    }



    render() {

        return <div className="Buzzer" ref={this.wrapperRef}>{this.props.children}
            <SettingsButton name = "" room = "" handleEdit = {this.handleEdit}></SettingsButton>

            <h1 className = "noselect">{this.state.name}</h1>
            <h1 className = "noselect">{this.state.room == null ||this.state.room == "" ? "" : "Room:"} {this.state.room}</h1>
        </div>;
    }
}