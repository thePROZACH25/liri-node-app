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

function userInputs(command, input) {
  switch (command) {
    case "concert-this":
      concert(input);
      break;
    case "spotify-this-song":
      music();
      break;
    case "movie-this":
      movie();
      break;
    case "do-what-it-says":
      random(input);
      break;
    default:
      console.log(
        `\n\n==============================\nPlease submit a valid request!\n==============================\n`
      );
  }
}
// Write to Log.txt file
function writeToLog() {
  fs.appendFile("log.txt", `${command}, ${input}\n`, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Content Added!");
    }
  });
}

userInputs(command, input);

// Bands In Town Function
function concert(artist) {
  var concertUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;

  axios.get(concertUrl).then(function (club) {
    for (var i = 0; i < 3; i++) {
      console.log(
        `\nVenue Name: ${club.data[i].venue.name}\nLocation in: ${
          club.data[i].venue.city
        }, ${club.data[i].venue.country}\nDate and Time: ${moment(
          club.data[i].datetime
        ).format("MM/DD/YYYY LT")}\n\n-------------------------------`
      );
    }
  });

  writeToLog();
}

// Spotify Function
function music() {
  if (command === "spotify-this-song" && process.argv[3] === undefined) {
    input = "The Sign";
  }
  spotify.search({ type: "track", query: input, limit: 1 }, function (
    err,
    radio
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    console.log(
      `\nArtist: ${radio.tracks.items[0].artists[0].name}\nTrack: ${radio.tracks.items[0].name}\nPreview Link: ${radio.tracks.items[0].uri}\nAlbum Name: ${radio.tracks.items[0].album.name}\n\n-------------------------------\n`
    );
  });

  writeToLog();
}

// IMDB Function
function movie() {
  if (command === "movie-this" && process.argv[3] === undefined) {
    input = "Mr. Nobody";
  }
  var movieURL = `http://www.omdbapi.com/?t=${input}&y=&plot=short&apikey=trilogy`;

  axios.get(movieURL).then(function (boxOffice) {
    console.log(
      `\nTitle: ${boxOffice.data.Title}\nRelease Date: ${boxOffice.data.Released}\nIMDB Rating: ${boxOffice.data.Ratings[0].Value}\nRotten Tomatoes Rating: ${boxOffice.data.Ratings[1].Value}\nCountry: ${boxOffice.data.Country}\nLangauge: ${boxOffice.data.Language}\nPlot: ${boxOffice.data.Plot}\nActors: ${boxOffice.data.Actors}\n\n-------------------------------\n`
    );
  });

  writeToLog();
}

// Random.txt function
function random() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }
    var dataArr = data.split(",");
    if (dataArr[0] === "spotify-this-song") {
      input = dataArr[1];
      music();
    } else if (dataArr[0] === "concert-this") {
      input = dataArr[1];
      length_of_name = input.length - 1;

      input = input.slice(1, length_of_name);
      concert(input);
    } else if (dataArr[0] === "movie-this") {
      input = dataArr[1];
      movie();
    }
  });
}
