import './SettingsMenu.css'

import xbutton from './assets/ei-close-o.svg'

import React from 'react';
import { BrowserRouter, NavLink, Route } from 'react-router-dom';


//TODO https://medium.com/@whwrd/building-a-beautiful-text-input-component-in-react-f85564cc7e86

const onSubmit = (e, handleClose, handleSubmit) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  handleSubmit(formData.get("name"), formData.get("roomcode"));
};
const SettingsMenu = ({ handleClose, show, children, handleSubmit, name, room }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button type="button" className="CloseSettingsButton" onClick={handleClose}><img src={xbutton} alt="Close Settings" height="100" width="100" /></button>
        <form className="buffered" onSubmit={e => onSubmit(e, handleClose, handleSubmit)}>
          <label for="name"><strong>Name </strong></label>
          <input type="text" name="name" defaultValue={name} autoComplete = "off" ></input><br></br>
          <label for="roomcode"><strong> Room # </strong></label>
          <input type="text" name="roomcode" defaultValue={room} autoComplete = "off"></input><br></br><br></br>
          <button className='form-submit-button' type="submit">Submit</button>
        </form>


      </section>
    </div>
  );
};

export default SettingsMenu;