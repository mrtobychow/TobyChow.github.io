/* jshint esversion:6 */
$(document).ready(function() {
    // Smooth scroll from https://css-tricks.com/snippets/jquery/smooth-scrolling/ //
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 39 // adjust for padding
                }, 1000);
                return false;
            }
        }
    });

    //------------------------ Animate when scrolled into view
    
    // selector caching - so we don't have to call the DOM each scroll
    var $animated = $('.animated'); // list of elements to be animated
    var $window = $(window);

    // runs event everytime user scroll or resize browser
    $window.on('scroll resize', checkInView);

    // trigger scrolls on load, check if there are elements to be animated in beginning view
    $window.trigger('scroll');

    // checks 

    function checkInView(){
        // Get dimensions of current viewport
        var windowHeight = $window.height();
        var windowTopPos = $window.scrollTop(); // gets scrollbar pos
        var windowBotPos = windowTopPos + windowHeight; // tracking bottom of viewport

        $.each($animated,function(){
            var $el = $(this);
            // Get dimensions and position of each element
            var elHeight = $el.outerHeight();
            var elTopPos = $el.offset().top;
            var elBotPos = (elTopPos + elHeight); // tracking bottom of el, ie: when el is fully in viewport

            // check if el is fully in viewport (*maybe try removing eltoppos<=windowbotpos)
            if ((elBotPos >windowTopPos) && (elTopPos < windowBotPos)){
                $el.addClass('in-view');
            }
            else{
                $el.removeClass('in-view');
            }
        });
    }

});
