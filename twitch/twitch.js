// Issues: streamers result not in order of array
// challenges: waiting for ajax call to complete before working with data
// get preivewpic from /channels, offline stream: data.stream = null, non existent = undefined
$(document).ready(function() {

    function twitchStreamer(query) {
        var streamLink;
        var status;
        var channelLogo;
        var previewPic;
        // data.stream returns null if stream is offline, or undefined if stream does not exist
        $.ajax({
            url: 'https://api.twitch.tv/kraken/channels/' + query,
            dataType: 'jsonp',
            type: 'GET',
            success: function(data) {
                streamLink = '<a target ="_blank" href="https://wwww.twitch.tv/' + query + '">' + query + '</a>';
                status = data.status;
                channelLogo = data.logo;

            }
        });

        $.ajax({
            url: 'https://api.twitch.tv/kraken/streams/' + query,
            dataType: 'jsonp',
            type: 'GET',
            success: function(data) {
                previewPic = (data.stream === null || data.stream === undefined) ? createTemplatePic(320, 180) : data.stream.preview.medium;

            }
        });

        console.log(status);

        function createDisplay() {
            var image = '<img class="preview" src="' + previewPic + '">';
            var bsCol = '<div class=col-md-4>';
            $('.row').append(bsCol + streamLink + image + status + channelLogo + '</div>');
        }

    }



    // function offlineStreamer(query) {
    //     $.ajax({
    //         url: 'https://api.twitch.tv/kraken/channels/' + query,
    //         dataType: 'jsonp',
    //         success: function(data) {
    //             if (data.error === 'Not Found') {
    //                 status = 'Account does not exist';
    //                 previewPicture = createTemplatePic(320, 180);
    //                 createDisplay();
    //             } else {
    //                 previewPicture = createTemplatePic(320, 180);
    //                 status = data.status;
    //                 channelLogo = data.logo;
    //                 createDisplay();
    //             }
    //         }
    //     });
    // }
    // Create default twitch preview icon 
    function createTemplatePic(width, height) {
        return 'http://static-cdn.jtvnw.net/previews-ttv/live_user_test_channel-' + width + 'x' + height + '.jpg';
    }

    var streamers = ['freecodecamp', 'voyboy', 'GosuGamers', 'potato', 'brunofin', 'comster404', 'nalcs1'];
    // Creates a preview picture, name, link, and description for each streamer
    streamers.forEach(function(streamer) {
        twitchStreamer(streamer);

    });


});
