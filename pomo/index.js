var React = require('react');
var ReactDOM = require('react-dom');

// components
import TimeInput from './components/TimeInput';
import TimeStatus from './components/TimeStatus';
import TimerButtons from './components/TimerButtons';
import Alarm from './components/Alarm';
import {playAlarm} from './components/Alarm';

// css
import {fontColor} from './css/fontColor';
import {fontStyle} from './css/fontStyle';
import {mainContainer,title,inputContainer} from './css/index';
document.body.style.backgroundColor = 'black';

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.setWorkTime = this.setWorkTime.bind(this);
        this.setBreakTime = this.setBreakTime.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.handleCountDown = this.handleCountDown.bind(this);
        this.stopCountDown = this.stopCountDown.bind(this);
        this.state = {
            'status': 'Work Time!',
            'workTime': '25', // in minutes, store initial time for 'reset' button
            'breakTime':'5', // in minutes
            'time': {'minutes':'25','seconds':'00'}, // initial times
            'isWorkTime':true,
            'isTimerActive':false,
        }
    }

    // callback for TimeInput, returns input value to workTime and time display
    setWorkTime(value){
    	this.setState({
			workTime:value
    	});
    	// update timer to match with work time
    	if(this.state.isWorkTime){
    		this.setState({
    			time:{minutes:value, seconds:'00'}
    		})
    	}
    }

    setBreakTime(value){
    	this.setState({
    		breakTime:value
    	})
    	// update timer match with break time
    	if(!this.state.isWorkTime){
    		this.setState({
    			time:{minutes:value, seconds:'00'}
    		})
    	}    	
    }

    // resets to initial time using workTime and breakTime state
    resetTimer(){
    	if(this.state.isWorkTime){
	    	this.setState({
	    		time:{minutes:this.state.workTime, seconds:'00'}
	    	})
	    }
	    else{
	    	this.setState({
	    		time:{minutes:this.state.breakTime, seconds:'00'}
	    	})
	    }
    	this.stopCountDown();
    }

    handleCountDown() {
        if(this.state.isTimerActive){
            return;
        }
        // sets timer to active
        this.setState({
            isTimerActive:true,
        })
        this.timer = setInterval(() => {
        	// when timer reaches zero
            if (this.state.time.minutes == 0 && this.state.time.seconds == 0) {
            	// if work time, switch to break time, and vice-versa
				this.setState({
					isWorkTime:!this.state.isWorkTime,
				})
				// allows isWorkTime to update before using calculations based on it (due to async nature of setState)
				this.setState({
					// timer uses work's timer or break's timer depending on state
					time:{minutes:(this.state.isWorkTime? this.state.workTime : this.state.breakTime), seconds:'00'}, 
					status:(this.state.isWorkTime? 'Work Time!' : 'Break Time!')
				})
				playAlarm(); 	
            }
            else{
            	// when seconds reaches zero, substract 1 minute, and set seconds to 59
            	if(this.state.time.seconds == '00'){
	            	this.setState({
	            		time:{minutes:this.state.time.minutes-1, seconds:'59'}
	            	})
	            }
	            else{
	            	this.setState({
	            		time:{minutes:this.state.time.minutes,seconds:this.state.time.seconds - 1}
	            	})
	            }
            }
        }, 1000);
    }

    stopCountDown(){
    	clearInterval(this.timer); // stop timer
        this.setState({
            isTimerActive:false,
        })
    }

    render() {
        let { status, time } = this.state;
        return (
            <div style={mainContainer}>
            	<h1 style={Object.assign({},fontStyle,fontColor,title)}>Pomodoro Clock</h1>
                <div style={inputContainer}>
    				<TimeInput 
    					onInput = {this.setWorkTime}
                        time = {this.state.workTime}
    					session = 'Work Session'/>

    				<TimeInput 
    					onInput = {this.setBreakTime}
                        time = {this.state.breakTime}
    					session = 'Break Session'/>
                </div>
				<TimeStatus 
					time = {time}
					status = {status}/>
				<TimerButtons 
					onStart = {this.handleCountDown}
					onPause = {this.stopCountDown}
					onReset = {this.resetTimer}/>
				<Alarm/>
			</div>
        );
    }
}

ReactDOM.render(<Timer/>, document.getElementById('root'));
