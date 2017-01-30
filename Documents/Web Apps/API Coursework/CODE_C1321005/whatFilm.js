// Code for film choosing algorithm based on the cast and crew of entered films.

/* Note a file name Old JS Examples.js which contains rememants codes of different
APIs I tried to include and other functions that did not quite work.
I have said where they initially went but have removed for further clarity to this
final code.*/

//Here is the code to store variables which are set outside the function.
var movieDBKey = 'be10449eb99417bd70e00af343a5b3c0';
var searchArray = [];
var castArray = [];
var counter = 0;
var xhr = new XMLHttpRequest();
var div = document.createElement('div');
var counter3 = 1;
div.id = 'searchedFilm';

//Sets up the button ready for input.
window.onload = function () {
    console.log("Ready");
    var add_button = document.getElementById('add_button');
    add_button.addEventListener('click', filmSearch);
};

//Searches for the users film in themoviedb API
var filmSearch = function () {
    counter++;
    var searchTerm = document.getElementById('add_film').value.split(' ').join('%20');
    // Makes the searchTerm go into the url
    //var searchTerm = searchTerm.split(' ').join('%20');
    console.log(searchTerm);
    console.log(counter);
    var url = 'https://api.themoviedb.org/3/search/movie?api_key=' + movieDBKey + '&language=en-US&query=' + searchTerm + '&page=1&include_adult=false';
    console.log(url);
    xhr.open("GET", url);
    xhr.addEventListener('load', processResponse);
    xhr.send();
};

//After getting the API response it is processed
var processResponse = function () {
    var data = JSON.parse(this.response);
    console.log(data);
    var body = document.getElementsByTagName('body')[0];
    var film_name = data.results[0].original_title;
    console.log(film_name);

    /* Film name and description used to come up along with the poster, but
    more often than not the film poster has the title on and the user will
    already know what the film is about, else they wouldn't have searched.*/

    //var text = document.createTextNode(film_name);
    //var paragraph = document.createElement('p');
    var img = document.createElement("img");
    img.src = 'http://image.tmdb.org/t/p/w185/' + data.results[0].poster_path;
    //paragraph.appendChild(text);
    //div.appendChild(paragraph);
    div.appendChild(img);
    body.appendChild(div);

    // Here the code finds the crew list by using the ID of the film to make another request.
    searchArray.push(data.results[0].id);
    console.log(searchArray);
    castList();
};

// This function should add the credits to the castArray
var castList = function () {

    document.getElementById('searchedFilm').style.display = "block";
    console.log(searchArray);

    for (var i in searchArray) {
        //For each film added, a new request is called which gets the cast and crew lists.
        var creditUrl = 'https://api.themoviedb.org/3/movie/' + searchArray[i] + '?api_key=' + movieDBKey + '&append_to_response=credits';
        console.log(creditUrl);
        xhr.open("GET", creditUrl);
        xhr.addEventListener('load', processCastList);
        xhr.send();
    }
};

// Here is the code to process the castList API request to get cast and crew names.
var processCastList = function () {
    var castData = JSON.parse(this.response);
    // Iterating through the list to add just the name of the individual cast memeber.
    for (var x = 0, l = castData.credits.cast.length; x < l; x++) {
        castArray.push(castData.credits.cast[x].name);
    }
    // Iterating through the list to add just the name of the individual crew memeber.
    for (var y = 0, t = castData.credits.crew.length; y < t; y++) {
        castArray.push(castData.credits.crew[y].name);
    }
    console.log(castArray);
    console.log(castData);

    //creates a hash table in order to sort the castArray by the the most commonly occuring items.
    // Code for hash function got from http://stackoverflow.com/a/41333805/6932541 on 26th December 2016.
    var hash = castArray.reduce(function(p, c) {
        p[c] = (p[c] || 0) + 1;
        return p;
    }, {});

    console.log(hash);
    //Makes sure each item is only shown once.
    var sortedCastArray = Object.keys(hash).sort(function(a, b) {
        return hash[b] - hash[a];
    });

    console.log(sortedCastArray);
    topCast = (sortedCastArray[0]);
    topCastSearch = topCast.split(' ').join('%20');
    console.log(topCast);

    /*The counter knows when 8 films have been entered and then automatically runs the
    code to display the cast or crew memeber that appears most commonly in all the films*/
    if (counter === 8) {
        secondTopCastArray = sortedCastArray;
        console.log(secondTopCastArray);
        var topCastUrl = 'https://api.themoviedb.org/3/search/person?api_key=' + movieDBKey + '&language=en-US&query=' + topCastSearch + '&page=1&include_adult=false';
        console.log(topCastUrl);
        var xhr2 = new XMLHttpRequest();
        xhr2.open("GET", topCastUrl);
        xhr2.addEventListener('load', processTopCastResponse);
        xhr2.send();
        document.getElementById("searchedFilm").style.display = "none";
        document.getElementById("searchForm").style.display = "none";
        document.getElementById("title").style.display = "none";

    }
};

var processTopCastResponse = function () {
    var topCastData = JSON.parse(this.response);
    console.log(topCastData);

    var body = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.id = 'personResponse';

    //Creating what needs to be displayed for the top person.
    var person = topCastData.results[0].name;
    var personNode = document.createTextNode(person);
    var personParagraph = document.createElement('p');
    var personImg = document.createElement("img");
    personImg.src = 'https://image.tmdb.org/t/p/w185/' + topCastData.results[0].profile_path;
    //Checks if the person has an image to display, if function means no dead img link will be shown if they don't.
    if (personImg.src != 'https://image.tmdb.org/t/p/w185/null') {
        div.appendChild(personImg);
    }
    personParagraph.appendChild(personNode);
    div.appendChild(personParagraph);
    body.appendChild(div);

    /*create a new button to allow user to see the next most commonly
    occuring cast or crew memember*/

    var button = document.createElement("input");
    button.type = "button";
    button.value = "Show me another film hero!";
    button.id = "buttonID";
    button.onclick = anotherTopCast;
    body.appendChild(button);

    /* The API only gives three films that the crew or cast are known for,
    so this shows those three results - even if the result is one that the user
    entered. I think it is interesting to see which film you entered they were in.
    The for loop will run 3 times, once for each film. */
    for (var i = 0, l = topCastData.results[0].known_for.length; i < l; i++) {

        //var body = document.getElementsByTagName('body')[0];

        var film_name = topCastData.results[0].known_for[i].original_title;

        var film_overview = topCastData.results[0].known_for[i].overview;
        console.log(film_name);

        /*This means if a tv show is suggested the name of the show will show;
        A film name is defined by original_title while tv by name.*/
        if (typeof film_name == 'undefined') {
            var film_name = topCastData.results[0].known_for[i].name;
        }

        var div = document.createElement('div');
        //So newFilms0, newFilms1 and newFilms3 will always be the 3 IDs.
        div.id = 'newFilms' + [i];

        var knownText = document.createTextNode(film_name);
        var knownText2 = document.createTextNode(film_overview);
        var knownParagraph = document.createElement('p');
        var knownParagraph2 = document.createElement('p');
        var knownImg = document.createElement("img");
        knownImg.src = 'http://image.tmdb.org/t/p/w185/' + topCastData.results[0].known_for[i].poster_path;

        knownParagraph.appendChild(knownText);
        knownParagraph2.appendChild(knownText2);
        div.appendChild(knownParagraph);
        div.appendChild(knownParagraph2);
        div.appendChild(knownImg);
        body.appendChild(div);
    }

};


var anotherTopCast = function () {
    counter3++;
    //The counter chooses what position in the TopCastArray should be chosen next.
    console.log(counter3);
    console.log(secondTopCastArray);
    topCast2 = (secondTopCastArray[counter3]);
    console.log(topCast2);
    topCastSearch2 = topCast2.split(' ').join('%20');
    console.log(topCastSearch2);
    //var secondTopCastArray = sortedCastArray;
    var topCastUrl2 = 'https://api.themoviedb.org/3/search/person?api_key=' + movieDBKey + '&language=en-US&query=' + topCastSearch2 + '&page=1&include_adult=false';
    console.log(topCastUrl2);
    var xhr2 = new XMLHttpRequest();
    /*The code then loops back to processTopCastResponse and can continue adding top cast / crew
    until the array is exhausted.*/
    xhr2.open("GET", topCastUrl2);
    xhr2.addEventListener('load', processTopCastResponse);
    xhr2.send();
};
