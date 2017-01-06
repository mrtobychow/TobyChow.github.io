let React = require('react');
//css
import {fontColor} from '../css/fontColor';
import {fontStyle} from '../css/fontStyle';
import {container,input,sessions} from '../css/timeInput/timeInput';

export default class TimeInput extends React.Component{

	// only allow inputs set by 'allowedKeys'
	handleKeyValidation(e){
		let allowedKeys = /^4[8-9]|^5[0-7]/g; // allows [0-9]
		let key = e.which || e.keyCode || 'error'; // get key code
		if (!allowedKeys.test(key)){ // disable unallowed keys
			e.preventDefault();			
		}
	}
	// get input value and runs callback set(work/break)time from index.js
	getInputValue(e){
		let value = e.target.value; // get value of input
		this.props.onInput(value); // updates display
	}

	render(){
		let { session } = this.props;
		// let a = (input) => this.nameInput = input;
		return(
			<div style={container}>
				<div style={Object.assign({},fontStyle,fontColor,sessions)}> {session} </div> 
				<input
					value={this.props.time}
					maxLength="2" 
					style={Object.assign({},fontStyle,fontColor,input)} 
					onKeyPress = {this.handleKeyValidation.bind(this)} 
					onChange={this.getInputValue.bind(this)} 
					type="text"/>
			</div>
			)
	}
} 