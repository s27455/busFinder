const gdańsk = ["06:50", "08:20", "10:20", "12:20", "13:20", "14:20", "14:50", "15:20", "15:50", "16:35", "17:20", "18:20", "19:50", "21:20", "24:00"];
const sztutowo = ["04:10", "05:10", "05:40", "06:10", "06:25", "07:10", "08:10", "10:40", "12:40", "14:40", "15:40", "16:40", "17:40", "19:40"];
const gdańskSaturday = ["08:15", "10:15", "12:15", "14:15", "16:15", "18:15", "20:15"];
const sztutowoSaturday = ["06:10", "08:10", "10:40", "12:40", "14:40", "16:40", "18:40"];
const gdańskSunday = ["08:15", "12:15", "16:15", "20:15"];
const sztutowoSunday = ["06:10", "10:40", "14:40", "18:40"];
const sztutowoArrival = ["08:05", "09:35", "11:35", "13:35", "14:35", "15:35", "16:05", "16:35", "17:05", "17:50", "18:35", "19:35", "21:05"];
const gdańskArrival = ["05:31", "06:31", "07:06", "07:36", "07:56", "08:36", "09:36", "12:16", "14:16", "16:16", "17:16", "18:11", "19:11","20:11"];
//in the future
//add saturday and sunday schedules

const schedules = {
    "Gdańsk": gdańsk,
    "Sztutowo": sztutowo,
    "GdańskSaturday": gdańskSaturday,
    "SztutowoSaturday": sztutowoSaturday,
    "GdańskSunday": gdańskSunday,
    "SztutowoSunday": sztutowoSunday,
    "SztutowoArrival": sztutowoArrival,
    "GdańskArrival": gdańskArrival
};

let locationName = "";
let departureCity = document.querySelector(".departure_city");
let arrivalCity = document.querySelector(".arrival_city");
let departureHouer = document.querySelector(".departure_houer");
let arrivalHouer = document.querySelector(".arrival_houer");
const background = document.querySelector(".scene");

function getGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        document.getElementById('location').innerText = 'Geolokalizacja nie jest wspierana przez tę przeglądarkę.';
    }
}

function success(position) {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    fetchLocationName(lat, long);
}

function error() {
    document.querySelector('.app_title').innerText = `Nie udało się uzyskać lokalizacji`;
}

function fetchLocationName(lat, long) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`)
        .then(response => response.json())
        .then(data => {
            locationName = data.address.city || data.address.town || data.address.village || "unknown location";
            // For Test Only
            // locationName="Gdańsk" 
            displayNextBus(locationName);
        })
        .catch(err => {
            document.querySelector('.app_title').innerText = `Nie udało się uzyskać lokalizacji`;
        });
}

function displayNextBus(location) {
    const day = getDay();
    let destination = location;

    if (day == 6) {
        destination += "Saturday";
    } else if (day == 0) {
        destination += "Sunday";
    }

    if (schedules[destination]) {
        const currentTime = getTime();
        
        const nextBusIndex = findNextBus(schedules[destination], currentTime);
        const nextBus = schedules[destination][nextBusIndex]; 
        const arrivalTime = arrivalTimeCalculator(nextBusIndex, destination);
        console.log(destination)
        
        let arrivalLocation = location === "Gdańsk" ? "Sztutowo" : "Gdańsk";
        departureCity.innerText = `${location}`;
        departureHouer.innerText = `Najbliższy bus: ${nextBus}`;
        arrivalHouer.innerText = `Przyjazd: ${arrivalTime}`;
        arrivalCity.innerText = `${arrivalLocation}`;

    } else {
        document.querySelector('.app_title').innerText = `Brak rozkładu jazdy dla ${location}`;
    }
}

function getDay() {
    const date = new Date();
    return date.getDay();
}

function getTime() {
    const date = new Date();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function convertTime(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function findNextBus(schedule, time) {
    let nextBusIndex = schedule.findIndex(bus => convertTime(bus) > convertTime(time));
    if (nextBusIndex === -1) nextBusIndex = 0;
    return nextBusIndex;
}


function arrivalTimeCalculator(busIndex, destination) {
    //in the future
    //add calculations to saturday and sunday 
    const scheduleName = destination.includes("Gdańsk") ? "SztutowoArrival" : "GdańskArrival";
    if (schedules[scheduleName]) {
        return schedules[scheduleName][busIndex];
    }
    return "Brak danych o przyjeździe";
}

function changeBackground(time) {
    const hours = parseInt(time.split(":")[0]);
    if (hours >= 5 && hours < 7) {
        background.style.background = "linear-gradient(to top, #d5dee7 0%, #ffafbd 0%, #c9ffbf 100%)";
    } else if (hours >= 20 && hours < 22) {
        background.style.background = "linear-gradient(to top, #f6d365 0%, #fda085 100%)";
    } else if (hours >= 22 || hours < 5) {
        background.style.background = "linear-gradient(to top, #09203f 0%, #537895 100%)";
    } else {
        background.style.background = "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)";
    }
}

changeBackground(getTime());
getGeolocation();
