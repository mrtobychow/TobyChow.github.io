/*jshint esversion: 6 */

$(document).ready(function() {

    // List of streamers to display
    var streamers = ['esl_csgo', 'freecodecamp', 'voyboy', 'reynad27', 'callofduty', 'kolento', 'imaqtpie', 'brunofin', 'comster404', 'nalcs1', 'nalcs2'];
    var copy = streamers.slice(0); // to be used for 'display' function, so 'streamers' can be perserved (.shift() mutates array)
    var numStreamers = streamers.length;
    var streamLink;
    var status;
    var channelLogo;
    var previewPic;
    var isOnline;
    // track number of streamers that are loaded and ready to be displayed
    var count = 0;

    var clientID = 'oqovo123t1rrdi3m1dyfx4lil5qf3d0'; // required for twitch authen

    // Get twitch API info and displays information
    function twitchAPI(query) {
        // Create promise container to ensure streamers displayed in the same order as the 'streamers' array
        return new Promise(function(resolve, reject) {

            // Creates default image for offline / non-existent accounts
            function createTemplatePic(width, height) {
                return 'http://static-cdn.jtvnw.net/previews-ttv/live_user_test_channel-' + width + 'x' + height + '.jpg';
            }

            //Call twitch API
            $.when(
                //  Get required data from different twitch api
                $.ajax({
                    url: `https://api.twitch.tv/kraken/channels/${query}?client_id=${clientID}`,
                    dataType: 'jsonp',
                    type: 'GET',
                    success: function(data) {
                        console.log(data);
                        streamLink = '<a target ="_blank" href="https://www.twitch.tv/' + query + '">' + query + '</a>';
                        status = data.status;
                        channelLogo = data.logo || null;
                    }
                }),

                $.ajax({
                    url: `https://api.twitch.tv/kraken/streams/${query}?client_id=${clientID}`,
                    dataType: 'jsonp',
                    type: 'GET',
                    success: function(data) {
                        isOnline = data.stream;
                        previewPic = (data.stream === null || data.stream === undefined) ? createTemplatePic(320, 180) : data.stream.preview.medium;
                    }
                })
            )

            .then(function() {

                // Assign appropriate stream status
                if (isOnline === null) {
                    status = 'Offline';
                } else if (status === 422 || status === 404) {
                    status = 'Account closed';
                }
                resolve(); // end of promise
            });
        });
    }


    function display(streamers) {
        // Removes first item in 'streamers' and stores value in 'streamer'
        var streamer = streamers.shift();
        // if not end of list
        if (streamer) {
            // Creates display after each streamer's data is obtained
            twitchAPI(streamer).then(function(result) {
                    // IIFE - Creates individual container for each streamer
                    (function createDisplay() {
                        var logo;
                        var image = '<img class="preview" src="' + previewPic + '">';
                        //checks if channel logo exists
                        if (channelLogo !== null) {
                            logo = '<img class="logo" src="' + channelLogo + '">';
                        } else {
                            logo = '<i class="fa fa-user fa-4x person-icon" aria-hidden="true"></i>';
                        }
                        // Creates html structure for each streamer                  
                        var bsCol = `<div class="col-md-4 col-sm-6 col-xs-12 streamer ${streamer}" data-name="${streamer}">`;
                        $('.streamer-container').append(
                            `${bsCol}
                                <div class="overlay">
                                    <a href="https://www.twitch.tv/${streamer}" target="_blank">
                                        <i class="fa fa-play-circle fa-5x play-btn" aria-hidden="true" style="display:none"></i>
                                     </a>
                                </div>
                                <div class="name">
                                    <i class="fa fa-times-circle delete-btn" aria-hidden="true"></i>
                                    ${streamer}
                                    <div class="logo">${logo}</div>
                                </div>
                                <div class="previewPic">${image}</div>
                                <div class="status">${status}</div>`);
                    })();

                    //Add status class 
                    if (status === 'Offline') {
                        $('.streamer-container').find(`.${streamer}`).addClass('offline');
                    } else if (status === 'Account closed') {
                        $('.streamer-container').find(`.${streamer}`).addClass('closed');
                    } else {
                        $('.streamer-container').find(`.${streamer}`).addClass('online');
                    }

                    // Shows play button on hover
                    $('.overlay,.preview').hover(function() {
                            // Only target the elements that belong to the hovered element (Ex: hovering freecodecamp only triggers its child .status, instead of all .status)
                            var overlay = $(this).parent('.previewPic').siblings('.overlay ');
                            var status = $(this).parent('.previewPic').siblings('.status');
                            var playBtn = $(this).find('.play-btn');
                            overlay.addClass('play');
                            $(playBtn).css('display', 'inline-block');
                            $(status).slideUp();
                        },
                        // Callback when hover off
                        function() {
                            $(this).removeClass('play'); // context of 'this' is changed??
                            $('.play-btn').hide();
                            var name = $(this).siblings('.name');
                            var status = $(this).siblings('.status');
                            $(status).slideDown();
                        });
                    // Attach delete event handler to 'delete-btn'
                    $('.delete-btn').on('click', function(event) {
                        var streamer = $(this).closest('.streamer');
                        $(streamer).remove();
                    });

                    // track streamers info that are ready to be displayed
                    count++;

                    //Only create next streamer's display after current streamer is complete to preserve the array's order (I guess it doesn't matter since I'm gonna sort it anyways)
                    display(streamers);

                })
                //Sort by status priority (online > offline > closed), and alphabetically within each of those statuses
                .then(function() {
                    //Sorts query alphabetically
                    function sortBy(query) {
                        query.sort(function(a, b) {
                                return (a.dataset.name).localeCompare(b.dataset.name);
                            })
                            .appendTo($container);
                    }
                    if (count === numStreamers) {
                        var $container = $('.streamer-container');
                        // Defining differnet queries to pass into sortBy function (sorting by online > offline > closed right now)
                        var alphabetical = $container.find('.streamer');
                        var statusOnline = $container.find('.online');
                        var statusOffline = $container.find('.offline');
                        var statusClosed = $container.find('.closed');
                        sortBy(statusOnline);
                        sortBy(statusOffline);
                        sortBy(statusClosed);
                    }
                })
                // Displays content and removes loading icon once all content is loaded (prevents loading each display one by one)
                .then(function() {
                    if (count === numStreamers) {
                        $('.loading').css('display', 'none');
                        $('.streamer').css('display', 'inline-block');
                    }
                });
        }
    }

    // Init
    display(streamers);

    // Adding new streamer to existing streamers from default list
    function addStreamer(streamer) {
        var newStreamer = streamer[0].toLowerCase();
        var streamerExist = $('.streamer-container').find('*').hasClass(newStreamer);
        if (streamer) {
            // fix .fadeOut default setting from display:none (which will prevent additional msgs to show)
            $('.alert-msg').css('display', 'block');
            if (!streamerExist) {
                count -= 1; // Remove 1 to account for adding a new streamer because count only tracks the original array length from 'streamers'
                copy = copy.concat(streamer);
                display(streamer);
                // alert msg on if adding new streamer
                $('.alert-msg').html(`<span class="label label-success alert">${newStreamer} added!</span>`)
                    .delay(1000)
                    .fadeOut(1000);
            } else {
                // alert msg if streamer exists
                $('.alert-msg').html(`<span class="label label-warning alert">${newStreamer} already exists!</span>`)
                    .delay(1000)
                    .fadeOut(1000);
            }
        }
    }

    // Adds streamer when search button is clicked
    $('.search-btn').on('click', function(event) {
        var query = $('.search-bar').val();
        addStreamer([query]);
    });

    // Adds streamer when 'enter' key is pressed
    $("input").on('keydown', function(evt) {
        if (evt.which === 13) {
            var query = $('.search-bar').val();
            addStreamer([query]);
        }
    });

});
