/* COLLECTION OF QUOTES */
var quotes = {
    'Let me give you some advice bastard Never forget what you areThe rest of the world will not. Wear it like armor, and it can never be used to hurt you.': 'Tyrion Lannister',
    'When you play the game of thrones, you win or you die. There is no middle ground.': 'Cersi Lannister',
    "Power resides where men believe it resides. It's a trick, a shadow on the wall. And a very small man can cast a very large shadow.": 'Varys',
    "Ooo, I'm a monster. Perhaps you should speak to me more softly then. Monsters are dangerous and just now kings are dying like flies.": 'Tyrion Lannister',
    "I will not give my life for Joffrey's murder. And I know I'll get no justice here. So I will let the gods decide my fate. I demand trial by combat.": "Tyrion Lannister",
    "Dracarys.": "Daenerys Stormborn",
    "If you think this has a happy ending, you haven't been paying attention": "Ramsay Bolton",
    "Rhaegar fought valiantly, Rhaegar fought nobly, Rhaegar fought honorably. And Rhaegar died.": "Jorah Mormont",
    "What is dead may never die, but rises again, harder and stronger.": "Aeron Damphair",
    "Promise me, Ned.": "Lyanna Stark",
    "Winter is coming.": "Eddard Stark"
};

// quote btn when clicked
$(".btn").click(function() {
    var quoteArr = Object.keys(quotes); // Stores all quotes
    var min = 0;
    var max = quoteArr.length;

    // Generates a random number from 0 to the number of quotes
    var ranNum = [Math.floor(Math.random() * max)];

    // Get quote/author pair from index of the random number
    var chosenQuote = quoteArr[ranNum];
    var author = quotes[chosenQuote];

    // Get new quote/author if currently displayed quote is the same as the new pair
    var currQuote = $(".quote").text();
    if (currQuote === chosenQuote) {
        chosenQuote = quoteArr[Math.floor(Math.random() * max)];
    }

    var chosenPair = [chosenQuote, author]; //  quote/author to be displayed
    var citation = '"' + chosenQuote + '"' + " -" + author; // used for tweet btn

    //Remove previous quote and citations
    $(".well .quote b").remove();
    $("cite").remove();

    //Add quote and author to '.well'
    $(".well .quote").append("<b></b>");
    $(".well b").append(chosenQuote);
    $(".well .cite").append("<cite>- </cite>");
    $(".well .cite cite").append(author);

    $('#tweetBtn iframe').remove();
    // Update twitter button with new quote
    var tweetBtn = $('<a></a>')
        .addClass('twitter-share-button')
        .attr('href', 'http://twitter.com/share')
        .attr('data-text', citation);
    $('#tweetBtn').append(tweetBtn);
    twttr.widgets.load();

});

$(document).ready(function() {
    // Runs script once to show an initial quote
    $(".btn").click();

});
