/* jshint esversion:6 */

// Carousel.js
// TODO: ADD LEFT/RIGHT ARROW KEYS FUNCTION TO SLIDE CAROUSEL
// data-img tracking the slot that the img is in now from original (ex: img-2 with data-img 0 = img-2 is at slot0)
$(window).load(function() {

    var screenWidth = $(window).width();
    var mobile = screenWidth <= 500;
    var mainDot = '2';
    var speed = 400;
    if (mobile) {
        $(".img-2").attr('src', '').removeClass('web').addClass('mobile');
    }
    // Left arrow is clicked
    $(".right-arrow").on('click', function(event) {
        if (mobile) {
            var imgSize = 500; // individual img size in px
            var numImg = 5;
            // px to shift for next image
            var newPos = (function getNewPos() {
                var maxSize = imgSize * (numImg - 1);
                var newPos = (+mainDot + 1) * imgSize;
                if (newPos > maxSize) { newPos = 0; }
                return '-'+ newPos;
            })();
            $(".img-2.mobile").animate({
                'background-position': newPos
            });

        } else {
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
            var dataSlideValue = $(".carousel-container").find("img.web").each(function(index, el) {
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
        }
        // dotsssssssssssssssssssss
        if (increment) {
            $(".active-dot").removeClass('active-dot');
            mainDot++;
            if (mainDot > 4) { mainDot = 0; }
            $(`[data-dot='${mainDot}']`).addClass('active-dot');

            // Change img-title and caption
            nextTitle = $(`.slot-${mainDot}  .img-title`).text();
            nextCaption = $(`.slot-${mainDot}  .caption`).text();
            $(".main-overlay  .img-title-display").text(nextTitle);
            $(".main-overlay  .caption-display").text(nextCaption);

            if(mobile){
                // animate pos
            }
        }

    });
    ////////////////////////////////////////// right arrow
    var increment = true;
    $(".left-arrow").on('click', function(event) {
        if (mobile) {
            var imgSize = 500; // individual img size in px
            var numImg = 5;
            // px to shift for next image
            var newPos = (function getNewPos() {
                var maxSize = imgSize * (numImg - 1);
                var newPos = (+mainDot - 1) * imgSize;
                if (newPos < 0) { newPos = maxSize; }
                return '-'+ newPos;
            })();
            $(".img-2.mobile").animate({
                'background-position': newPos
            });

        } else {
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

            var dataSlideValue = $(".carousel-container").find("img.web").each(function(index, el) {
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
        }
        // dotsssssssssssssssssssss
        if (increment) {
            $(".active-dot").removeClass('active-dot');
            mainDot--;
            if (mainDot < 0) { mainDot = 4; }
            $(`[data-dot='${mainDot}']`).addClass('active-dot');
            // Change img-title and caption
            nextTitle = $(`.slot-${mainDot}  .img-title`).text();
            nextCaption = $(`.slot-${mainDot}  .caption`).text();
            $(".main-overlay  .img-title-display").text(nextTitle);
            $(".main-overlay  .caption-display").text(nextCaption);
        }
    });

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

    // Overlay

    var width = $(".slot-2").width();
    var height = $(".slot-2").height();
    $(".main-overlay").css({
        width: width,
        height: height
    });

    // fix positioning on windows resize
    window.onresize = function() {
        if (!mobile) {
            increment = false;
            $(".right-arrow").click();
            increment = true;
        }
        //main display size
        var width = $(".slot-2").width();
        var height = $(".slot-2").height();
        //overlay
        $(".main-overlay").css({
            width: width,
            height: height
        });

    };
});

// Display initial message
$(document).ready(function() {
    $(".main-overlay  .img-title-display").text(function() {
        return $(".slot-2 > .img-title").text();
    });

    $(".main-overlay  .caption-display").text(function() {
        return $(".slot-2 > .caption").text();
    });

    // Info-icon button
    $(".info-icon").on('click', function(event) {
        $(this).toggleClass('active');
        $(".info").slideToggle();
        /* Act on the event */
    });
});
