import React, { Component } from 'react';
//css
import {fontColor} from '../css/fontColor';
import {fontStyle} from '../css/fontStyle';
import {container,state,timer} from '../css/timeStatus/timeStatus';

export default class TimeStatus extends Component {
	render() {
		let { status, time } = this.props;
		// adds zero infront of single digit seconds
		if (time.seconds <= 9 && time.seconds!== '00'){
			time.seconds = '0'+ time.seconds.toString();
		}
		return (
			<div style={container}>
				<div style={Object.assign({},state,fontStyle,fontColor)}>{status}</div>
				<div style={Object.assign({},timer,fontStyle,fontColor)}>{time.minutes}:{time.seconds}</div>
			</div>
		);
	}
}
