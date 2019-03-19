var app = new Framework7 ({
    root: "#app",
    /* app element */
    routes: [
        {
            path: '/',
            url: 'index.html',
        },
        {
            path: '/page2/',
            url: 'pages/page2.html',
        }
    ]
});

var mainView;
mainView = app.views.create('.view-main');

var xmlhttp;
var weatherURL;
var lat;
var lon;
var temp;
var desc;
var max;
var min;
var wind;
var toggle = false;

findMe();


//	start	using	plugin	here.	
var geoOpts = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 3000,
}

var watchId;
function findMe() {
    watchId = navigator.geolocation.watchPosition(geoSuccess, error, geoOpts)
}

function geoSuccess(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    console.log("Lat: " + lat + " Long: " + lon);
    weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=metric&APPID=ac4442d3cc94f73f2a14aabd2a07da36";
    weather();
    
    function weather() {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', weatherURL, true); //this changes the state of xmlhttp
    xmlhttp.send();
    xmlhttp.onreadystatechange = getWeather;
}


function getWeather() { // when readystate changes
      
    //check to see if the client -4 and server -200 is ready
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

        var json = JSON.parse(xmlhttp.responseText);
        
        function Forcast(Temp, Descrip, Wind, Max, Min, Humid) {  
             
            temp = Math.round(Temp);
            desc= Descrip;
            min = Math.round(Min);
            max= Math.round(Max);
            wind = Wind;
            
            console.log("Temperature: " + temp +" celcius");
            console.log("Description: " + desc);
            console.log("Min Temperature: " + min +" celcius");
            console.log("Max Temperature: " + max +" celcius");
            console.log("Wind: " + wind +" km/h");
            if (mainView.router.currentRoute.url == 'pages/page2.html') { 
                if(temp <= 13) { 
            document.getElementById("status").src = "imgs/snowflake.png";
            $("#desc").empty();
            $("#desc").append("The temperature outside is too cold for your honey bees to collect nectar and produce honey.<br><br> On cold days bees will huddle together inside their hive inorder to stay warm. They rotate from the center of the huddle to the edges so that every bee can survive the cold days.");
            $("#page2_bg").css("background-color","#c6efff");
                } else if(temp >= 38) { 
            document.getElementById("status").src = "imgs/fire.png";
            $("#desc").empty();
            $("#desc").append("The temperature outside is too hot for your honey bees to collect nectar and produce honey.<br><br> On hot days bees will gather around outside in shaded areas inorder to stay cool.");
            $("#page2_bg").css("background-color","#ff9d00");
                } else { 
            document.getElementById("status").src = "imgs/honey.png";
            $("#desc").empty();
            $("#desc").append("The temperature outside is just right! Your honey bees will collect nectar and produce honey.<br><br> Sit back and cheer them on!");
            $("#page2_bg").css("background-color","#ffeaba");
                }
            $("#temp").empty();
            $("#temp").append(temp + "&deg;" + "C");
            } else {
            Redirect();
            }
            
            return(temp);
    }

        var current = new Forcast(json.main.temp, json.weather[0].description, json.wind.speed, json.main.temp_max, json.main.temp_min, json.main.humidity );

        console.log("all info received from server");

        }
    }
}


function error(message) {
    console.log("Did not find you!");
}

function Redirect() 
{   
    mainView.router.load({
        path: '/page2/',
        url: 'pages/page2.html'
    })
} 


