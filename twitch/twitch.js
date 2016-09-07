/*jshint esversion: 6 */
// Issues: 
//streamers result not in order of array
//mouseleave does not register if moving mouse across preview quickly
// challenges: 
//waiting for ajax call to complete before working with data, 
//fixed hover flickering issue
//tree traversal for different 'this' values
//hovering on overlapping elements
//Sorting streamers first by status, then if online, by alphabetical name
//Ordering columns with bootstrap's push/pull classes
$(document).ready(function() {

    // List of streamers to display
    var streamers = ['esl_csgo', 'freecodecamp', 'Voyboy', 'reynad27', 'callofduty', 'Kolento', 'Imaqtpie', 'brunofin', 'comster404', 'nalcs1', 'nalcs2'];
    var numStreamers = streamers.length;
    // can use result object after resolve to clean up global namespace
    var streamLink;
    var status;
    var channelLogo;
    var previewPic;
    var isOnline;
    // track number of streamers that are loaded and ready to be displayed
    var count = 0;

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
                $.ajax({
                    url: 'https://api.twitch.tv/kraken/channels/' + query,
                    dataType: 'jsonp',
                    type: 'GET',
                    success: function(data) {
                        streamLink = '<a target ="_blank" href="https://www.twitch.tv/' + query + '">' + query + '</a>';
                        status = data.status;
                        channelLogo = data.logo || null;
                    }
                }),

                $.ajax({
                    url: 'https://api.twitch.tv/kraken/streams/' + query,
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
        // Removes first item in 'streamers' and returns value to 'streamer'
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
                    //Appends status (online / offline /closed) to bsCol
                    if (status === 'Offline') {
                        $('.streamer-container').find(`.${streamer}`).addClass('offline');
                    } else if (status === 'Account closed') {
                        $('.streamer-container').find(`.${streamer}`).addClass('closed');
                    } else {
                        $('.streamer-container').find(`.${streamer}`).addClass('online');
                    }
                    // Shows play button on hover
                    $('.overlay,.preview').hover(function() {
                            var overlay = $(this).parent('.previewPic').siblings('.overlay ');
                            var name = $(this).parent('.previewPic').siblings('.name ');
                            var status = $(this).parent('.previewPic').siblings('.status');
                            var playBtn = $(this).find('.play-btn');
                            overlay.addClass('play');
                            $(playBtn).css('display', 'inline-block');
                            // $(name).add(status).fadeOut(); //.add to add multiple variable selectors
                            $(status).slideUp();
                        },
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

                    //Only create next streamer's display after current streamer is complete to preserve the array's order
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
                        // Defining differnet queries to pass into sortBy function
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

    function addStreamer(streamer) {
        if (streamer) {
            // Remove 1 to account for adding a new streamer because count only tracks the original array length from 'streamers'
            count -= 1;
        }
        display(streamer);
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
