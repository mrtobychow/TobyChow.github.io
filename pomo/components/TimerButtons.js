import React, { Component } from 'react';
//css
import {fontColor} from '../css/fontColor';
import {fontStyle} from '../css/fontStyle';
import {container,button} from '../css/buttons/buttons';

// Buttons share same css
let Button = (props) => <button style={Object.assign({},fontStyle,button)} {...props}>{props.text}</button>

TimerButtons.propTypes = {
	onStart: React.propTypes.func,
	onPause: React.propTypes.func,
	onReset: React.propTypes.func,
}

export default class TimerButtons extends Component {

	render() {
		return (
			<div style={container}>
				<Button onClick = {this.props.onStart} text='Start'/>
				<Button onClick = {this.props.onPause} text='Pause'/>
				<Button onClick = {this.props.onReset} text='Reset'/>
			</div>
		);
	}
}
