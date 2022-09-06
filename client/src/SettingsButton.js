import './SettingsButton.css'

import React, { Component } from 'react';
import SettingsMenu from './SettingsMenu'
import gear from './assets/evil_icons_gear_MIT.svg'


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {    // Update state so the next render will show the fallback UI.    
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {      // You can render any custom fallback UI      
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}


//learned from DigitalOcean
class SettingsButton extends Component {
  constructor(props) {




    super(props);
    this.state = {
      showMenu: !this.verifySettings(),
      room: props.room,
      name: props.name
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.verifySettings = this.verifySettings.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }


  showModal() {

    this.setState({
      showMenu: true
    })
  };

  hideModal() {
    this.setState({
      showMenu: false
    })

  }
  handleClose() {
    if (this.verifySettings()) {
      this.setState({
        showMenu: false
      });
    }
    else{
      return;
    }
    const name = localStorage.getItem("name");
    const room = localStorage.getItem("room");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,
        room: room
      })
    };
    fetch(window.location.origin + "/api/register", requestOptions)
      .then(response => {
        if (response.status != 200) {
          this.showModal();
          return;
        }
        else {
          this.props.handleEdit(name, room);

        }
      });

  }


  verifySettings() {
    if (localStorage.getItem("name") == null || localStorage.getItem("name") == "" ||
      localStorage.getItem("room") == null || localStorage.getItem("room") == "") {
      return false;
    }
    return true;
  }

  componentDidMount() {
    if (!this.verifySettings()) {
      this.showModal();
    }
    else {
      this.handleSubmit(localStorage.getItem("name"), localStorage.getItem("room"));
    }
  }

  handleSubmit(name, room) {


    localStorage.setItem("name", name);
    localStorage.setItem("room", room);


    if (!this.verifySettings()) {
      this.showModal();
      return;
    }
    else {
      this.hideModal();
      this.setState({

        name: name,
        room: room
      });

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          room: room,
        })
      };
      fetch(window.location.origin + "/api/register", requestOptions)
        .then(response => {
          if (response.status != 200) {
            this.showModal();
            return;
          }
          else {
            this.props.handleEdit(name, room);

          }
        });


    }








  }

  render() {
    return (
      <div>
        <ErrorBoundary>
          {/*<Navigate to = {this.state.showMenu ? "/settings" : "/" } replace = {true}></Navigate>*/}
        </ErrorBoundary>
        <SettingsMenu show={this.state.showMenu} handleClose={this.handleClose} handleSubmit={this.handleSubmit} room="" name=""></SettingsMenu>
        <button type="button" className="SettingsButton" onClick={this.showModal}>
          <img className="GearIcon" src={gear} height="100%" width="100%" />
        </button>
      </div>
    );
  }

}
export default SettingsButton;