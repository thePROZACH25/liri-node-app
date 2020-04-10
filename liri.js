require("dotenv").config();

// Grab Spotify keys securely
var keys = require("./keys");

// Grab the axios package
var axios = require("axios");

// Grab the moment package
var moment = require("moment");

// Grab and read random.txt file
var fs = require("fs");

// Grab the spotify package
var Spotify = require(`node-spotify-api`);
var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
// Slice and rejoin incase artist or band has spaces in the name
var input = process.argv.slice(3).join(" ");

switch (command) {
  case "concert-this":
    concert();
    break;
  case "spotify-this-song":
    music();
    break;
  case "movie-this":
    movie();
    break;
  case "do-what-it-says":
    random();
    break;
  default:
    console.log(
      `\n\n==============================\nPlease submit a valid request!\n==============================\n`
    );
}

// Bands In Town Function
function concert() {
  var concertUrl = `https://rest.bandsintown.com/artists/${input}/events?app_id=codingbootcamp`;

  axios.get(concertUrl).then(function (club) {
    for (var i = 0; i < club.data.length; i++) {
      console.log(
        `\nVenue Name: ${club.data[i].venue.name}\nLocation in: ${
          club.data[i].venue.city
        }, ${club.data[i].venue.country}\nDate and Time: ${moment(
          club.data[i].datetime
        ).format("MM/DD/YYYY LT")}\n\n-------------------------------`
      );
    }
  });
}

// Spotify Function
function music() {
  spotify.search({ type: "track", query: input }, function (
    err,
    radio
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log(`\nArtist: ${radio.tracks.items[0].artists[0].name}\nTrack: ${radio.tracks.items[0].name}\nPreview Link: ${radio.tracks.items[0].uri}\nAlbum Name: ${radio.tracks.items[0].album.name}\n\n-------------------------------`);
  });
}

// IMDB Function
function movie() {
  var movieURL = `http://www.omdbapi.com/?t=${input}&y=&plot=short&apikey=trilogy`;

  axios.get(movieURL).then(function (boxOffice) {
    console.log(
      `\nTitle: ${boxOffice.data.Title}\nRelease Date: ${boxOffice.data.Released}\nIMDB Rating: ${boxOffice.data.Ratings[0].Value}\nRotten Tomatoes Rating: ${boxOffice.data.Ratings[1].Value}\nCountry: ${boxOffice.data.Country}\nLangauge: ${boxOffice.data.Language}\nPlot: ${boxOffice.data.Plot}\nActors: ${boxOffice.data.Actors}\n\n-------------------------------`
    );
  });
}

// Random.txt function
