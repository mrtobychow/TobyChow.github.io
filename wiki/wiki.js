/*jshint esversion: 6 */
$(document).ready(function() {

    var query;

    // Get Wikipedia's API
    function wikiData(query) {
        $.ajax({
            url: "http://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=max&format=json&exsentences=1&exintro=&explaintext=&generator=search&gsrlimit=10&gsrsearch=" + query,
            dataType: 'jsonp',
            type: 'GET',
            success: function(data) {
                // Message if no results available
                if (!data.hasOwnProperty('query')) {
                    $('.content').append('<div class="alert alert-warning" role="alert">No Results Available</div>');
                }
                var result = data.query.pages;
                for (var key in result) {
                    var pageInfo = result[key];
                    //Creates individual boxes for each title and corresponding description
                    $('.content').append(
                        `<div class="panel panel-info col-md-6">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    <a target="_blank" href="https://en.wikipedia.org/?curid=${pageInfo.pageid}">${pageInfo.title}</a>
                                </h3>
                            </div>
                            <div class="panel-body">${pageInfo.extract}</div>
                        </div>`);
                }
            }
        });
    }
    //Updates recent search bar, clears content section and displays new results
    function displayResults() {
        $('.content').html('');
        query = $("input").val();
        //Updates 'Recent Search' bar
        if (query !== '') {
            $('.web').append('<button type="button" class="list-group-item recent-search-result">' + query + '</button>');
            $('.dropdown-menu').append('<li class="recent-search-result mobile-result">' + query + '</li><li role="separator" class="divider recent-search-result"></li>');
        }
        wikiData(query);
    }

    //Displays results when search button is clicked
    $(".search").on('click', displayResults);


    //Remove search results and query on 'X' click
    $(".remove").click(function() {
        $("input").val('');
        $("input").focus();
        $('.content').html('');
    });

    //Display results when 'Enter' key pressed
    $("input").on('keydown', function(evt) {
        if (evt.which === 13) {
            displayResults();
        }
    });

    //Clears 'Recent Search' when 'x' on recent search btn clicked 
    $('.recent-btn').on('click', function() {
        $('.recent-search-result').remove();
    });

    //Displays results when a topic under 'Recent Search' is clicked
    $(document).on('click', '.recent-search-result', function() {
        query = $(this).text();
        $('.content').html('');
        wikiData(query);
    });

    //Hover on '.recent-search-result' (requires this method for dynamic elements)
    $(document).on({
        mouseenter: function() {
            $(this).css({
                "white-space": "normal",
                "overflow": "visible",
                "z-index": "1",
                "min-width": "11em",
                // Experimental
                "width": "max-content"
            });
        },
        mouseleave: function() {
            $(this).css({
                "white-space": "nowrap",
                "overflow": "hidden",
                "text-overflow": "ellipsis",
                "width": "11em",
                "z-index": "0"
            });
        },
    }, '.recent-search-result');

});
