import React, { Component } from 'react';
import './Buzzer.css'
class Buzzer extends Component {
    constructor(props){
        super(props);
        this.state = {
            color: "green",
            text: "Buzz",
            name: "Jon",
            buzzed: false
        }
        this.buzz = this.buzz.bind(this);
        
    }
    buzz(){
        var data = {
            "name": this.state.name
        }
        fetch("/buzz",{
            method: "POST",
            body: JSON.stringify(data)

        }).then(this.setState({
            buzzed: !this.state.buzzed
        }))

    }
    render(){
        return(
            <div className = "Buzzer">
            
            <button className={'BuzzerButton' + (this.state.buzzed ? 'Green' : 'Coral')}
            onClick={this.buzz}>Buzz</button>
            <h2 class="noselect">{this.props.name}</h2>
            <h2 class="noselect">{this.props.teamName}</h2>
            </div>
        )
    }
}


export default Buzzer;
