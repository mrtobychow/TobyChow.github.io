/*jshint esversion: 6 */
// Issues: 
//streamers result not in order of array
//mouseleave does not register if moving mouse across preview quickly
// challenges: 
//waiting for ajax call to complete before working with data, 
//fixed hover flickering issue
//tree traversal for different 'this' values
//creating overlay of play button
$(document).ready(function() {

    // List of streamers to display
    var streamers = ['esl_csgo', 'freecodecamp', 'voyboy', 'reynad27', 'joshog', 'Kolento', 'potato', 'brunofin', 'comster404', 'nalcs1', 'nalcs2'];
    var numStreamers = streamers.length;
    // can use result object after resolve to clean up global namespace
    var streamLink;
    var status;
    var channelLogo;
    var previewPic;
    var isOnline;
    var count = 0;

    // Get twitch API info and displays information
    function twitchAPI(query) {
        // Create promise container to ensure streamers displayed in the same order as the 'streamers' array
        return new Promise(function(resolve, reject) {
            // Creates default image for offline / non-existent accounts
            function createTemplatePic(width, height) {
                return 'http://static-cdn.jtvnw.net/previews-ttv/live_user_test_channel-' + width + 'x' + height + '.jpg';
            }
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

                // Display appropriate stream status
                if (isOnline === null) {
                    status = 'Offline';
                } else if (status === 422) {
                    status = 'Account closed';
                }

                // Attach 'offline' and 'closed' status if applicable
                if (status === 'Offline') {
                    $(`.${query} > .status`).addClass('offline');
                }
                if (status === 'Account closed') {
                    $(`.${query} > .status`).addClass('closed');
                }

                resolve();
            });
        });
    }

    function display(streamers) {
        // Removes first item in 'streamers' and returns value to 'streamer'
        var streamer = streamers.shift();
        if (streamer) {
            // Creates display after each streamer's data is obtained
            twitchAPI(streamer).then(function(result) {
                    console.log(result);
                    // IIFE - Creates individual container for each streamer
                    (function createDisplay() {
                        var logo;
                        var image = '<img class="preview" src="' + previewPic + '">';
                        //checks if channel logo exists
                        if (channelLogo !== null) {
                            logo = '<img class="logo" src="' + channelLogo + '">';
                        } else {
                            logo = "";
                        }
                        // Creates html structure for each streamer                  
                        var bsCol = `<div class="col-md-4 col-sm-6 col-xs-12 streamer ${streamer}">`;
                        $('.row').append(
                            `${bsCol}
                <div class="overlay">
                    <a href="https://www.twitch.tv/${streamer}" target="_blank">
                        <i class="fa fa-play-circle fa-5x play-btn" aria-hidden="true" style="display:none"></i>
                    </a>
                </div>
                <div class="name">${streamer}
                    <div class="logo">${logo}</div>
                </div>
                <div class="status">${status}</div>
                <div class="previewPic">${image}</div>
                `);
                    })();

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
                            console.log(name);
                            var status = $(this).siblings('.status');
                            $(status).slideDown();
                        });

                    // track streamers info that are ready to be displayed
                    count++;

                    //Only create next streamer's display after current streamer is complete to preserve the array's order
                    display(streamers);
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
});
