/* jshint esversion:6 */

// Carousel.js
// data-img tracking the slot that the img is in now from original (ex: img-2 with data-img 0 = img-2 is at slot0)
$(window).load(function() {

    var mainDot = '2';
    var speed = 400;
    // Left arrow is clicked
    $(".right-arrow").on('click', function(event) {
        var mainWidth = $(".curr-img-container").width();
        var mainHeight = $(".curr-img-container").height();

        var sideWidth = $(".slot-0").width();
        var sideHeight = $(".slot-0").height();

        var slots = {};


        (function getSlotCoord() {
            $(".carousel-container").find("[class*='slot-']").each(function(index, el) {
                slots[index] = { x: $(this).offset().left, y: $(this).offset().top };
            });
        })();
        var dataSlideValue = $(".carousel-container").find("img").each(function(index, el) {
            var imgValue = Number(this.dataset.img);
            if (increment) {
                if (imgValue <= 0) {
                    imgValue = 4;
                    this.dataset.img = 4;
                } else {
                    imgValue -= 1;
                    this.dataset.img -= 1;
                }
            }
            // if img is going into slot-2 (ie:main display)
            if (+(this.dataset.img) === 2) {
                $(this).css({
                        'position': 'absolute',
                        width: '150px',
                        height: '150px'
                    }) // shrink image to preview slide size
                    .animate({
                        width: mainWidth,
                        height: mainHeight,
                        left: slots[+imgValue].x, // account for margin
                        top: slots[+imgValue].y
                    }, speed);
            }
            if (+(this.dataset.img) === 4) {
                var offsetDistance = $(window).width() + sideWidth;
                $(this).css({
                        'position': 'absolute',
                        width: '150px',
                        height: '150px'
                    })
                    .offset({
                        top: $(".slot-4").offset().top,
                        left: offsetDistance
                    })
                    .animate({
                        width: sideWidth,
                        height: sideHeight,
                        left: slots[4].x,
                        top: slots[4].y
                    }, speed);
            }
            if (+(this.dataset.img) !== 2 && +(this.dataset.img) !== 4) {
                $(this).css({
                        'position': 'absolute',
                        width: '150px',
                        height: '150px'
                    }) // shrink image to preview slide size
                    .animate({
                        width: sideWidth,
                        height: sideHeight,
                        left: slots[+imgValue].x, // account for margin
                        top: slots[+imgValue].y
                    }, speed);
            }
        });
        // dotsssssssssssssssssssss
        if (increment) {
            $(".active-dot").removeClass('active-dot');
            mainDot++;
            if (mainDot > 4) { mainDot = 0; }
            $(`[data-dot='${mainDot}']`).addClass('active-dot');
        }
    });
    ////////////////////////////////////////// right arrow
    var increment = true;
    $(".left-arrow").on('click', function(event) {

        var mainWidth = $(".curr-img-container").width();
        var mainHeight = $(".curr-img-container").height();

        var sideWidth = $(".slot-0").width();
        var sideHeight = $(".slot-0").height();

        var slots = {};


        (function getSlotCoord() {
            $(".carousel-container").find("[class*='slot-']").each(function(index, el) {
                slots[index] = { x: $(this).offset().left, y: $(this).offset().top };
            });
        })();

        function addUnicodeBy1(str) {
            return String.fromCharCode(str.charCodeAt() + 1);
        }

        var dataSlideValue = $(".carousel-container").find("img").each(function(index, el) {
            var imgValue = Number(this.dataset.img);

            if (increment) {
                if (imgValue >= 4) {
                    imgValue = 0;
                    this.dataset.img = 0;
                } else {
                    imgValue += 1;
                    this.dataset.img = addUnicodeBy1(this.dataset.img);
                }
            }
            // if img is going into slot-2 (ie:main display)
            if (+(this.dataset.img) === 2) {
                $(this).css({
                        'position': 'absolute',
                        width: sideWidth,
                        height: sideHeight
                    }) // shrink image to preview slide size
                    .animate({
                        width: mainWidth,
                        height: mainHeight,
                        left: slots[+imgValue].x, // account for margin
                        top: slots[+imgValue].y
                    }, speed);
            }
            if (+(this.dataset.img) === 0) {
                var offsetDistance = $(window).width() + sideWidth;
                $(this).css({
                        'position': 'absolute',
                        width: sideWidth,
                        height: sideHeight
                    })
                    .offset({
                        top: $(".slot-0").offset().top,
                        left: '-200'
                    })
                    .animate({
                        width: sideWidth,
                        height: sideHeight,
                        left: slots[0].x,
                        top: slots[0].y
                    }, speed);
            }
            if (+(this.dataset.img) !== 2 && +(this.dataset.img) !== 0) {
                $(this).css({
                        'position': 'absolute',
                        width: sideWidth,
                        height: sideHeight
                    }) // shrink image to preview slide size
                    .animate({
                        width: sideWidth,
                        height: sideHeight,
                        left: slots[+imgValue].x, // account for margin
                        top: slots[+imgValue].y
                    }, speed);
            }
        });
        // dotsssssssssssssssssssss
        if (increment) {
            $(".active-dot").removeClass('active-dot');
            mainDot--;
            if (mainDot < 0) { mainDot = 4; }
            $(`[data-dot='${mainDot}']`).addClass('active-dot');
            console.log(mainDot);
        }
    });
    // fix positioning on windows resize
    window.onresize = function() {
        increment = false;
        $(".right-arrow").click();
        increment = true;
    };


    // Dots function
    $(".dot").on('click', function(event) {
        var leftCount = 0;
        var rightCount = 0;
        var clickedDot = +this.dataset.dot;
        var start = +mainDot;
        speed = 200;
        function distanceCheck(direction) {
            while (start !== clickedDot) {

                if (direction === 'left') {
                    leftCount++;
                    start--;
                    if (start < 0) {
                        start = 4;
                    }
                }
                if (direction === 'right') {
                    rightCount++;
                    start++;
                    if (start > 4) {
                        start = 0;
                    }
                }
            }
            start = +mainDot; // resets start to do left check
        }
        distanceCheck('right');
        distanceCheck('left');
        if (leftCount < rightCount) {
            var c = 0;
            while (c < leftCount) {
                $(".left-arrow").click();
                c++;
            }
        } else {
            var x = 0;
            while (x < rightCount) {
                $(".right-arrow").click();
                x++;
            }
        }
        speed = 400;
    });
});
