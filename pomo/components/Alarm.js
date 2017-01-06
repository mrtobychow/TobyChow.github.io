import React, { Component } from 'react';

//css
import {container} from '../css/alarm/alarm';

export default class Alarm extends Component {

	render() {
		return (
			<div style={container}>
				<audio id="alarm" src="./alarm.mp3" volume="0.0" loop="true" controls></audio>
			</div>
		);
	}
}

export let playAlarm = function(){
	alarm.currentTime = 0;
	alarm.play();
	// set length of alarm
	setTimeout(function() { alarm.pause(); }, 5000);
}
