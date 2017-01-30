// Here is what I like to call the Javascript graveyard for code which didn't work.

/*Here is the code to allow users to press enter as well as click the button,
I am unsure why it didn't function properly, it would have gone in the window.onload
function*/

add_film.addEventListener('keyup', function(event) {
    event.preventDefault();
    if (event && event.keyCode === 13) {
        filmSearch();
        return true;
    }
});


/* Here is the wikipedia API that I tried to include to give the descriptions for the films.
Ultimately it was too complicated with time constraints to add it to my code as I would
have had to changed it a lot to facilitate it.

I did get it to the stage where it would display the descriptions for the films, however
if a film wasn't available it would sometimes put the description under the wrong film.
Also for some examples, like 'Jaws' it would come up with the result of a human jaw rather
than the film. There is a way round this by only searching for wikipedia articles under
the category of english language films, however I didn't want to limit my users.

There was also an issue with giving a unique div id each time, which would have meant I
would have had to limit the results in order to conform with my CSS style sheet which is
limited to three div responses, in correspondence with the 3 known for film responses from
the movie database.*/


//The below code would have been in processTopCastResponse

filmSuggestionName = film_name.split(' ').join('%20');
filmSuggestionSearch = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + filmSuggestionName + '&origin=*';
console.log(filmSuggestionSearch);
var xhr3 = new XMLHttpRequest();
xhr3.open("GET", filmSuggestionSearch);
xhr3.send();

//The function belows logs the wikipedia extract of a films article
var processSuggestionSearch = function(){
  counter4++;
  console.log(counter4);
  var suggestionData = JSON.parse(this.response);
  console.log(suggestionData);
  console.log(suggestionData.query.pages);
  var pageid = Object.keys(suggestionData.query.pages)[0];
  console.log(pageid);
  var search = suggestionData.query.pages[pageid].extract;
  console.log(search);
  var n = search.includes("is a");
  // If n is true then the wikipedia article description should be right as it always starts 'film name' is a... ;
  if (n == true){
    console.log('Yes');
    var div = document.getElementById("newFilms" + counter4);
    console.log(div)
    var wikiText = document.createTextNode(search);
    div.appendChild(wikiText);
  }
  else{
    console.log('no');
  }
}

/* My other attempt to include another API was using YouTube. Unfortunately I found including
the player into the page too complex, though I was able to get the youtube ID and so link to the video.
Here is my attempt at including the player within my code:*/

// These first few lines without a function would have been in processTopCastResponse

filmSuggestionId = topCastData.results[0].known_for[i].id;
filmSuggestionSearch = 'http://api.themoviedb.org/3/movie/' + filmSuggestionId + '/videos?api_key=' + movieDBKey;
console.log(filmSuggestionSearch);

//It would have got the unique YouTubeID which would then have been used to display the right video.

var processSuggestionSearch = function() {
    idCounter++;
    var suggestionData = JSON.parse(this.response);
    console.log(suggestionData);
    var YouTubeId = suggestionData.results[0].key;

    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var videoId = null;

    //function onYouTubeIframeAPIReady() {
    if (idCounter === 1) {
        videoId = YouTubeId;
        YouTube();
    };
    if (idCounter === 2) {
        videoId = YouTubeId;
        YouTube();
    };

    if (idCounter === 3) {
        videoId = YouTubeId;
        YouTube();
        console.log('you got here okay');
    };
};

/*The YouTube function would have been called which should have utilised the code
from the website but I could not make it work, below is the code from the YouTube page,
most of it is as it is shown on their page, including comments.*/

var YouTube = function() {
    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
    }

    function stopVideo() {
        player.stopVideo();
    }
}
