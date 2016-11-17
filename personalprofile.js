/* jshint esversion:6 */
$(document).ready(function() {

 // Smooth scroll from https://css-tricks.com/snippets/jquery/smooth-scrolling/ //
 $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {
        var target = $(this.hash);
         console.log(`target is ${target}, location.pathname is ${location.pathname} location.hostname is ${location.hostname}`);
         console.log(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
           if (target.length) {
             $('html,body').animate({
                 scrollTop: target.offset().top
            }, 1000);
            return false;
        }

    }
});


//// Carousel ////
    var speed = 300; // speed of animation
    var tablet = 768; // tablet px size

    // Displays initial title,caption, and links of main display from slot 2
    (function displayMainText() {
        $('.slot2 .display-title').text($('.slot2 .main-title').text());
        $('.slot2 .display-caption').text($('.slot2 .caption').text());
        //display github and site link of main display
            var slot2Github = $('.slot2 .github-link').attr('href');
            var slot2Site = $('.slot2 .site-link').attr('href');
            $('.main-content .display-github-link').attr('href', slot2Github);
            $('.main-content .display-site-link').attr('href', slot2Site);
    })();

    // Info display fnc for tablet only
    $('.info-icon').on('click', function(event) {
        var mainInfo = $('.slot2 .info').html();
        $('.info-display').html(mainInfo);
        $('.info-display').slideToggle();
    });

    // When left arrow of carousel is clicked
    $(".left-arrow").on('click', function(event) {

        // Get dimensions of the side panels
        var sideWidth = $('.slot0').width();
        var sideHeight = $('.slot0').height();

        // Used to manipulate dataset values since it is stored as strings
        function addUnicodeBy1(str) {
            return String.fromCharCode(str.charCodeAt() + 1);
        }

        // Stores dimensions(top and left) of each panels
        var slots = {};

        (function getSlotCoord() {
            $(".carousel-container").find("[class*='slot']").each(function(index, el) {
                slots[index] = { x: $(this).position().left, y: $(this).position().top };
            });
        })();

        $(".carousel-container").find(".to-move").each(function(index, el) {
            var initialSlot = +this.dataset.img;
            // loops back last img to the first slot
            if (initialSlot === 4) {
                this.dataset.img = 0;
            } else {
                this.dataset.img = addUnicodeBy1(this.dataset.img);
            }

            function animateSlide(target, destination) {
                var differenceX = slots[1].x - slots[0].x; // assuming evenly spaced slots
                var differenceY;
                if (destination === '.slot2') {
                    differenceY = slots[2].y - slots[1].y;
                } else if (destination === '.slot3') {
                    differenceX = slots[3].x - slots[2].x;
                    differenceY = slots[3].y - slots[2].y;
                }

                var targetWidth = $(target).width();
                var targetHeight = $(target).height();
                var destinationWidth = $(destination).width();
                var destinationHeight = $(destination).height();
                $(target)
                    .css({
                        'position': 'absolute',
                        width: targetWidth,
                        height: targetHeight
                    })
                    .animate({
                        left: differenceX, // only if flex is space evenly distributed
                        top: differenceY,
                        width: destinationWidth,
                        height: destinationHeight
                    }, speed, function cb() {
                        // Callback to cement new .to-move into DOM
                        $(target).remove().appendTo(destination).css({
                            left: '0', // resets positioning after inserting img into new DOM
                            top: '0',
                            width: '100%',
                            height: '100%',
                            position: 'static' // must be static
                        });
                    });
            }
            var target = el; // stores img classes only;
            var destination = `.slot${this.dataset.img}`;
            animateSlide(target, destination);
            console.log($(`.slot2 .title`).text());
        });


        // animate dots and change title / caption display
        (function animateDotLeft() {
            // get data-dot with the active-dot
            var activeDot = $('.active-dot').removeClass('active-dot');
            var activeDotData = +activeDot[0].dataset.dot;
            activeDotData--;
            if (activeDotData < 0) {
                activeDotData = 4;
            }
            $(`[data-dot=${activeDotData}]`).addClass('active-dot');

            // Get title and caption from parent of img's original slot
            var newTitle = $(`.slot1 .main-title`).text(); // slot1 to get text that would be GOING to slot2
            var newCaption = $(`.slot1 .caption`).text();

            // insert new title / caption into slot 2
            $('.main-content .display-title').text(newTitle);
            $('.main-content .display-caption').text(newCaption);

            // Get info of next slide going into main display
            var newInfo = $('.slot1 .info').html();

            // Updates main display info
            $('.info-display').html(newInfo);

            // Get next slide's new github and site link
            var newGithubLink = $('.slot1 .github-link').attr('href');
            var newSiteLink = $('.slot1 .site-link').attr('href');

            // Update main display with new links
            $('.main-content .display-github-link').attr('href', newGithubLink);
            $('.main-content .display-site-link').attr('href', newSiteLink);
        })();
    });


    // When right arrow is clicked
    $(".right-arrow").on('click', function(event) {

        var sideWidth = $('.slot0').width();
        var sideHeight = $('.slot0').height();

        function minusUnicodeBy1(str) {
            return String.fromCharCode(str.charCodeAt() - 1);
        }

        var slots = {};

        (function getSlotCoord() {
            $(".carousel-container").find("[class*='slot']").each(function(index, el) {
                slots[index] = { x: $(this).position().left, y: $(this).position().top };
            });
        })();

        $(".carousel-container").find(".to-move").each(function(index, el) {

            var initialSlot = +this.dataset.img;
            // loops back last img to the first slot
            if (initialSlot === 0) {
                this.dataset.img = 4;
            } else {
                this.dataset.img = minusUnicodeBy1(this.dataset.img);
            }

            function animateSlide(target, destination) {
                var differenceX = slots[0].x - slots[1].x; // assuming evenly spaced slots
                var differenceY;
                if (destination === '.slot2') {
                    differenceX = slots[2].x - slots[3].x;
                    differenceY = slots[2].y - slots[3].y;
                } else if (destination === '.slot1') {
                    differenceX = slots[1].x - slots[2].x;
                    differenceY = slots[1].y - slots[2].y;
                }

                var targetWidth = $(target).width();
                var targetHeight = $(target).height();
                var destinationWidth = $(destination).width();
                var destinationHeight = $(destination).height();
                var difference = slots[1].x - slots[0].x; // assuming evenly spaced slots
                $(target)
                    .css({
                        'position': 'absolute',
                        width: targetWidth,
                        height: targetHeight
                    })
                    .animate({
                        left: differenceX, // only if flex is space evenly distributed
                        top: differenceY,
                        width: destinationWidth,
                        height: destinationHeight
                    }, speed, function cb() {
                        // Callback to cement new .to-move into DOM
                        $(target).remove().appendTo(destination).css({
                            left: '0', // resets positioning after inserting img into new DOM
                            top: '0',
                            width: '100%',
                            height: '100%',
                            position: 'static' // must be static
                        });
                    });
            }
            var target = el; // stores img classes only
            console.log(target);
            var destination = `.slot${this.dataset.img}`;
            animateSlide(target, destination);
        });

        // animate dots and change title / caption display
        (function animateDotRight() {
            var activeDot = $('.active-dot').removeClass('active-dot');
            // get data-dot of the active-dot to keep track of dot position
            var activeDotData = +activeDot[0].dataset.dot;
            activeDotData++;
            if (activeDotData > 4) {
                activeDotData = 0;
            }
            // Add class .active-dot to the new active dot
            $(`[data-dot=${activeDotData}]`).addClass('active-dot');

            // Get title and caption going to slot2 (ie: get from slot3)
            var newTitle = $(`.slot3 .main-title`).text();
            var newCaption = $(`.slot3 .caption`).text();

            // insert new title / caption into slot 2
            $('.main-content .display-title').text(newTitle);
            $('.main-content .display-caption').text(newCaption);

            // Get info of next slide going into main display
            var newInfo = $('.slot3 .info').html();
            // Updates main display info
            $('.info-display').html(newInfo);
            // Get next slide's new github and site link
            var newGithubLink = $('.slot3 .github-link').attr('href');
            var newSiteLink = $('.slot3 .site-link').attr('href');

            // Update main display with new links
            $('.main-content .display-github-link').attr('href', newGithubLink);
            $('.main-content .display-site-link').attr('href', newSiteLink);
        })();
    });

    // Change active (white) dot to the clicked dot
    $(".dot").on('click', function(event) {
        var leftCount = 0;
        var rightCount = 0;
        var clickedDot = +this.dataset.dot;
        var start = $('.active-dot')[0].dataset.dot;
        var count = +start;

        function distanceCheck(direction) {
            console.log(count);
            while (count !== clickedDot) {

                if (direction === 'left') {
                    leftCount++;
                    count--;
                    if (count < 0) {
                        count = 4;
                    }
                }
                if (direction === 'right') {
                    rightCount++;
                    count++;
                    if (count > 4) {
                        count = 0;
                    }
                }
            }
            count = start; // resets start to do left check
        }
        distanceCheck('right');
        distanceCheck('left');
        // Go left if it is the shortest route, otherwise go right
        if (leftCount < rightCount) {
            var c = 0;
            while (c < leftCount) {
                // Fix with arrows clicking too quickly, resulting in only 1 click no matter distance
                setTimeout(function() {
                    speed = 100;
                    $(".left-arrow").click();
                    speed = 300;
                }, (c * (300)));
                c++;
            }
        } else {
            var x = 0;
            while (x < rightCount) {
                // same fix as left arrow
                setTimeout(function() {
                    speed = 100;
                    $(".right-arrow").click();
                    speed = 300;
                }, (x * (300)));
                x++;
            }
        }

    });
    $('.left').on('click', function(event) {

        setTimeout(function() {
            $('.left-arrow').click();
        }, 400);
        setTimeout(function() {
            $('.left-arrow').click();
        }, 800);

    });

});
