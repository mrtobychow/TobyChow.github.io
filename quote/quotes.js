/* Further Improvements : No repeat quotes, Seperate quotes for each houses, Optimize code

/* COLLECTION OF QUOTES */
var Quotes = {
    'Let me give you some advice bastard Never forget what you areThe rest of the world will not. Wear it like armor, and it can never be used to hurt you': 'Tyrion Lannister',
    'When you play the game of thrones, you win or you die. There is no middle ground.': 'Cersi Lannister',
    "Power resides where men believe it resides. It's a trick, a shadow on the wall. And a very small man can cast a very large shadow.": 'Varys',
    "Ooo, I'm a monster. Perhaps you should speak to me more softly then. Monsters are dangerous and just now kings are dying like flies.": 'Tyrion Lannister',
    "I will not give my life for Joffrey's murder. And I know I'll get no justice here. So I will let the gods decide my fate. I demand trial by combat.": "Tyrion Lannister",
    "Dracarys": "Daenerys Stormborn",
    "If you think this has a happy ending, you haven't been paying attention": "Ramsay Bolton",
    "Rhaegar fought valiantly, Rhaegar fought nobly, Rhaegar fought honorably. And Rhaegar died.": "Jorah Mormont",
    "What is dead may never die, but rises again, harder and stronger.": "Aeron Damphair",
    "Promise me, Ned.": "Lyanna Stark",
    "Winter is coming.": "Eddard Stark"
};

$(".btn").click(function() {
    var quoteArr = Object.keys(Quotes);
    var min = 0;
    var max = quoteArr.length;
    var ranNum = [Math.floor(Math.random() * (max - min) + min)];
    var chosenQuote = quoteArr[ranNum];
    var chosenPair = [chosenQuote, Quotes[chosenQuote]];
    var quote = chosenPair[0];
    var author = chosenPair[1];
    var citation = '"' + quote + '"' + " -" + author;
    $(".well .quote b").remove();
    $(".well .cite cite").remove();
    $(".well .quote").append("<b></b>");
    $(".well b").append(quote);
    $(".well .cite").append("<cite>- </cite>");
    $(".well .cite cite").append(author);

    $('#tweetBtn iframe').remove();
    // Generate new markup
    var tweetBtn = $('<a></a>')
        .addClass('twitter-share-button')
        .attr('href', 'http://twitter.com/share')
        .attr('data-text', citation);
    $('#tweetBtn').append(tweetBtn);
    twttr.widgets.load();
});

/* RUNS SCRIPT ONCE WHEN HTML IS LOADED SO A QUOTE IS DISPLAYED INITIALLY */
$(document).ready(function() {
    $(".btn").click();
});
