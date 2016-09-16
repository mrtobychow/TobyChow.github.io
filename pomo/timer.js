//FEATURES: USER INPUTS ONLY BETWEEN 1-60, ALARM SOUND, START / PAUSE / RESET, TAB FUNCTIONS ADDED

//CONCEPTS LEARNED: regex / keydown vs keypress vs keyup / evt.which / .find / setInterval & clearInterval / review : and :: selectors

//TODO: ALLOW USERS TO SET ALARM LENGTH
// BUG IF SINGLE NON ZERO NUM + (VERY QUICKLY PRESS BACKSP AND ZERO) / 
// PRESS ENTER TO START / CLICKING ON BUTTON MAKES THE WINDOW LOSE FOCUS, NEED TO CLICK ON SCREEN TO USE SPACEBAR TO START&PAUSE AGAIN
// Add responsive design
// Prevent arrow func if number is hilighted


$(document).ready(function() {

    var workTimer;

    // Initial work minutes / seconds
    var startWorkMinute = 25;
    var startWorkSeconds = 0;

    // Initial break minutes / seconds
    var startBreakMinute = 5;
    var startBreakSeconds = 0;

    var isPaused = true;

    // Stores alarm DOM
    var alarm = $('#alarm')[0];

    // 37-40 = arrow keys / 48-57 = [0-9] / 8 = backspace / 9 = tab / 32 = spacebar / 
    var allowedCodes = /^3[7-9]|^40|^4[9]|^5[0-7]|^8$|^32$|^9$/g;

    var inputLen;

    // Track if '0' is allowed as an input 
    var selOverride = false;

    // Prevents '0' as the first or only digit as input for hi-lighting
    $('input').select(function(evt) {
        var startIndex = evt.currentTarget.selectionStart;
        var endIndex = evt.currentTarget.selectionEnd;
        // start:0 end:2  represents hilighting both digits, 0:1 means hilighting the tens digit
        if ((startIndex === 0 && endIndex === 2) || (startIndex === 0 && endIndex === 1)) {
            allowedCodes = /^3[7-9]|^40|^4[9]|^5[0-7]|^8$|^32$|^9$/g;
        }
        selOverride = true;
    });

    // Enables tabbing between work and break inputs
    $('input').on('keydown', function(evt) {
        // Prevents space-bar from scrolling page (since it is used to start/pause timer)
        if (evt.which === 32) {
            evt.preventDefault();
        }
        // 9 = 'tab' key
        if (evt.which === 9) {
            if ($(".start-work-display").is(':focus')) {
                $(".start-break-display").focus();
            } else {
                $(".start-work-display").focus();
            }
            //evt.preventdefault to prevent tabbing past start break minute display
            evt.preventDefault();
        }
    });

    Init();


    function inputLength() {
        $("input").keyup(function() {
            inputLen = ($(this).val().length);
        });
    }

    //  Prevents '0' as the first or only digit as input without hi-lighting
    function checkDigit() {
        inputLength();
        // Prevents adding '0' if display is empty 
        if ((inputLen === 0 || inputLen === undefined) && selOverride === false) {
            allowedCodes = /^3[7-9]|^40|^4[9]|^5[0-7]|^8$|^32$|^9$/g;
        } else if (selOverride === false) {
            allowedCodes = /^3[7-9]|^40|^4[8-9]|^5[0-7]|^8$|^32$|^9$/g;
        }
    }

    // Only allow numbers to input
    function isNum(evt) {
        var charCode = evt.which;
        // if keycode is identified (error checking)
        if (charCode !== 0) {
            // Only displays character if keycode is allowed
            if (charCode.toString().match(allowedCodes) === null) {
                evt.preventDefault();
                console.log(
                    "Please use lowercase letters only." + "\n" + "charCode: " + charCode + "\n"
                );
            } else {
                startWorkMinute = $(".start-work-display").val();
            }
        }
    }

    // Checks if input is valid (non-zero as first/only digit, and no alphabet)
    function Init() {
        $("input").keydown(function(evt) {
            checkDigit();
            isNum(evt);
        });
    }

    function playAlarm() {
        // Sets initial timestamp
        alarm.currentTime = 0;
        alarm.play();
        setTimeout(function() { alarm.pause(); }, 8000);
    }


    // Enable arrow buttons to increment / decrement time
    function bindClick() {
        $("#add-work-min").on("click", function() {
            startWorkMinute += 1;
            startWorkSeconds = 0;
            display();
        });

        $("#minus-work-min").click(function() {
            if ($(".start-work-display").val() <= 1) {
                // Prevents timer from going below 1
                startWorkMinute -= 0;
            } else {
                startWorkMinute -= 1;
                startWorkSeconds = 0;
                display();
            }
        });

        $("#add-break-min").click(function() {
            startBreakMinute += 1;
            display();
        });

        $("#minus-break-min").click(function() {
            if ($(".start-break-display").val() <= 1) {
                startBreakMinute -= 0;
            } else {
                startBreakMinute -= 1;
                startBreakSeconds = 0;
                display();
            }
        });
    }
    bindClick();

    // Remove arrow buttons' functionality (to be used when timer is running)
    function unbindClick() {
        $(".start-time").find('span').off();
    }

    // Pausecount to prevent multiple bindings to arrow buttons (0 = PAUSED, 1 = UNPAUSED)
    var pauseCount = 1;

    function pause() {
        isPaused = true;
        if (pauseCount > 1) {
            bindClick();
            pauseCount = 0;
            $("input").attr("disabled", false);
        }
    }
    $('#pause').click(pause);

    // TRACK IF TIMER IS CURRENTLY RUNNING A SESSION, ALLOWS START BUTTON TO FUNCTION PROPERLY AFTER WORK AND BREAK TIMER NATURALLY TIMES OUT
    var timing = false;

    function start() {
        if (timing === false) {
            workTimer = setInterval(timer, 1000);
        }
        isPaused = false;
        unbindClick();
        timing = true;
        // Will always allow bind click on reset or pause click
        pauseCount += 2;
        $("input").attr("disabled", true);
    }
    $('#start').click(start);


    //SPACE BAR TO TOGGLE BETWEEN START AND PAUSE BUTTONS
    $(document).keyup(function(evt) {
        if (evt.which === 32 && isPaused === true) {
            start();
        } else if (evt.which === 32 && isPaused === false) {
            pause();
        }
    });

    // RESET BUTTON 

    $("#reset").click(function() {
        alarm.pause();
        $("#status").val('Work Time!');
        startWorkMinute = 25;
        startWorkSeconds = 0;
        startBreakMinute = 5;
        startBreakSeconds = 0;
        isPaused = true;
        if (timing === true) {
            unbindClick();
            timing = false;
        }
        //Prevents multiple bind clicks (fix reset->pause, multiple binds)
        if (pauseCount > 1) {
            bindClick();
            pauseCount = 0;
        }
        clearInterval(workTimer);
        display();
        $("input").attr("disabled", false);
    });

    // DISPLAYS INITIAL WORK/BREAK SESSION AND GET INITIAL START TIME VALUE FOR COUNTDOWN TIMER

    function display() {
        if (startWorkMinute <= 9) {
            $("#work-minutes-display").text('0' + startWorkMinute);
            $(".start-work-display").val(startWorkMinute);
        } else {
            $("#work-minutes-display").text(startWorkMinute);
            $(".start-work-display").val(startWorkMinute);
        }
        if (startWorkSeconds <= 9) {
            $("#work-seconds-display").text('0' + startWorkSeconds);
        } else {
            $("#work-seconds-display").text(startWorkSeconds);
        }
        if (startBreakMinute <= 9) {
            $(".start-break-display").val(startBreakMinute);
        } else {
            $(".start-break-display").val(startBreakMinute);
        }
    }
    display();

    // COUNT TO STOP LOOP AFTER BREAK TIMER ENDS
    var count = 1;

    //COUNTDOWN TIMER FUNCTION

    function timer() {
        if (!isPaused) {
            if (startWorkSeconds - 1 >= 0) {
                if (startWorkSeconds - 1 <= 9) {
                    startWorkSeconds -= 1;
                    $("#work-seconds-display").text('0' + startWorkSeconds);
                } else {
                    startWorkSeconds -= 1;
                    $("#work-seconds-display").text(startWorkSeconds);
                }
            } else if (startWorkMinute === 0 && startWorkSeconds === 0) {
                if (count === 0) {
                    playAlarm();
                    clearInterval(workTimer);
                } else {
                    $("#status").text('Break Time!');
                    startWorkSeconds = startBreakSeconds;
                    startWorkMinute = startBreakMinute;
                    playAlarm();
                    //DISPLAY INITIAL BREAK TIME
                    if (startWorkMinute <= 9) {
                        $("#work-minutes-display").text('0' + startWorkMinute);
                    } else {
                        $("#work-minutes-display").text(startWorkMinute);
                    }
                    if (startWorkSeconds <= 9) {
                        $("#work-seconds-display").text('0' + startWorkSeconds);
                    } else {
                        $("#work-seconds-display").text(startWorkSeconds);
                    }
                    count -= 1;
                }
            } else {
                startWorkSeconds = 59;
                $("#work-seconds-display").text(startWorkSeconds);
                if (startWorkMinute - 1 <= 9) {
                    startWorkMinute -= 1;
                    $("#work-minutes-display").text('0' + startWorkMinute);

                } else {
                    startWorkMinute -= 1;
                    $("#work-minutes-display").text(startWorkMinute);
                }
            }
        }
    }

    // ALLOW USERS TO MANUALLY INPUT SESSION LENGTHS
    $("input").on("input", function(evt) {
        var inputType = $(this).attr('class');
        if (inputType == 'start-work-display') {
            startWorkMinute = $(this).val();
            display();
        } else {
            startBreakMinute = $(this).val();
            display(); 
        }
        selOverride = false;
    });

});
