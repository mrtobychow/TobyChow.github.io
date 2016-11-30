/*jshint esversion: 6 */

var query;
var input = document.getElementsByTagName('input')[0]; // returns array of matched tags
var content = document.getElementsByClassName('content')[0]; // returns array of matched el

//Updates recent search bar, clears content section and displays new results
function displayResults() {

    //---------------------------- updating recent search bar
    // clear content section
    content.innerHTML = ('');
    // $('.content').html('');

    // Store user query from search bar
    var query = input.value;
    // query = $("input").val();

    //Updates 'Recent Search' bar
    if (query !== '') {
        var web = document.getElementsByClassName('web')[0];
        var resultHTML = document.createElement('button'); // creates new button tag
        // set class name and type attributes of new button tag
        resultHTML.className = ('list-group-item recent-search-result');
        resultHTML.setAttribute('type', 'button');
        resultHTML.innerHTML = query;
        // add event handlers for dynamic elements
        resultHTML.addEventListener('mouseenter', mouseEnterHandler);
        resultHTML.addEventListener('mouseleave', mouseLeaveHandler);
        // append new button to recent search bar
        web.appendChild(resultHTML);
        // $('.web').append('<button type="button" class="list-group-item recent-search-result">' + query + '</button>');

        // updates recent search bar for mobile
        var dropdownMenu = document.getElementsByClassName('dropdown-menu')[0];
        var mobileResultHTML = document.createElement('li');
        mobileResultHTML.className = ('recent-search-result mobile-result');
        mobileResultHTML.innerHTML = `${query} <li role="separator" class="divider recent-search-result"></li>`;
        dropdownMenu.appendChild(mobileResultHTML);
        // $('.dropdown-menu').append('<li class="recent-search-result mobile-result">' + query + '</li><li role="separator" class="divider recent-search-result"></li>');
    }
    //--------------------------------

    // Display query results
    wikiData(query);
}

//--------------------------- Get Wikipedia's API
function wikiData(query) {
    // create HTTP request
    var httpRequest = new XMLHttpRequest(); // create instance of XMLHTTP 

    // make request
    // note, must pass in &origin=* for CORS 
    var url = "http://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&exlimit=max&format=json&exsentences=1&exintro=&explaintext=&generator=search&gsrlimit=10&gsrsearch=" + query;
    httpRequest.open('GET', url);
    httpRequest.send(null); // data to send if using 'POST'

    // action to take after server response
    httpRequest.onreadystatechange = function() {
        // check state of request, XMLHttpRequest.DONE evalutes to 4 if full server response has been received
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            // check if AJAX successful (200 OK)
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText); // parse data received as JSON string into a JS object
                // Message if no results available
                if (!data.hasOwnProperty('query')) {
                    // create node to append to '.content'
                    var noResultsHTML = document.createElement('div');
                    noResultsHTML.className = 'alert alert-warning';
                    noResultsHTML.setAttribute('role', 'alert');
                    noResultsHTML.textContent = 'No Results Available';
                    // append new node to content
                    content.appendChild(noResultsHTML);
                }
                var result = data.query.pages;
                for (var key in result) {
                    var pageInfo = result[key];
                    //Creates individual boxes for each title and corresponding description
                    var resultNode = document.createElement('div');
                    resultNode.className = 'panel panel-info col-md-6';
                    resultNode.innerHTML = `
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    <a target="_blank" href="https://en.wikipedia.org/?curid=${pageInfo.pageid}">${pageInfo.title}</a>
                                </h3>
                            </div>
                            <div class="panel-body">${pageInfo.extract}</div>
                        `;
                    content.appendChild(resultNode);
                }
            } else {
                alert('Error:' + httpRequest.status);
            }
        }
    };
}


//Displays results when search button is clicked
var search = document.getElementsByClassName('search')[0];
search.addEventListener('click', displayResults);


//Remove search results and query on 'X' click
var remove = document.getElementsByClassName('remove')[0];
remove.addEventListener('click', function() {
    input.value = '';
    input.focus();
    content.innerHTML = '';
});

//Display results when 'Enter' key pressed
input.addEventListener('keydown', function(evt) {
    if (evt.which === 13) {
        displayResults();
    }
});

//Clears 'Recent Search' when 'x' on recent search btn clicked 
var recentBtn = document.getElementsByClassName('recent-btn')[0];
recentBtn.addEventListener('click', function() {
    var recentSearchResult = document.getElementsByClassName('recent-search-result');
    console.log(document.getElementsByClassName('recent-search-result'));
    // remove all elemenets with class '.recent-search-results' stored in recentSearchResult
    while (recentSearchResult[0]) {
        // while recentSearchResult is not empty...
        recentSearchResult[0].parentNode.removeChild(recentSearchResult[0]);
    }
});

//Displays results when a topic under 'Recent Search' is clicked
document.addEventListener('click', function(evt) {
    // targets '.recent-search-result' only, need to add event listener to document for dynamically added elements!
    if ((evt.target.className).indexOf('recent-search-result') > -1) {
        query = evt.target.textContent; // get text of selected element
        content.innerHTML = '';
        wikiData(query);
    }
});


function mouseEnterHandler(evt) {
    if ((evt.target.className).indexOf('recent-search-result') > -1) {
        var target = evt.target.style;
        target.whiteSpace = 'normal';
        target.overflow = 'visible';
        target.zIndex = '1';
        target.minWidth = '11em';
        target.color = 'red';
    }
}

function mouseLeaveHandler(evt) {
    if ((evt.target.className).indexOf('recent-search-result') > -1) {
        var target = evt.target.style;
        target.whiteSpace = 'nowrap';
        target.overflow = 'hidden';
        target.textOverflow = 'ellipsis';
        target.width = '11em';
        target.zIndex = '0';
        target.color = 'black';
    }
}
