const statusText = document.getElementById("status")
const modal = document.getElementById("modal")
const title = document.getElementById("modal-title")
const text = document.getElementById("modal-text")
const closeBtn = document.getElementById("close")

let triggered = {}

closeBtn.onclick = () => {
  modal.classList.add("hidden")
}

if(navigator.onLine){
  alert("For best accuracy turn off Wi-Fi/Data so GPS is used.")
}

/* 
ACCURACY SETTINGS
--------------------------------
Typical accuracy values:
GPS: 3m – 15m
WiFi: 20m – 50m
Cell: 100m – 1000m
*/

const REQUIRED_ACCURACY = 25 // meters

function distance(lat1, lon1, lat2, lon2){

const R = 6371000

const φ1 = lat1 * Math.PI/180
const φ2 = lat2 * Math.PI/180
const Δφ = (lat2-lat1) * Math.PI/180
const Δλ = (lon2-lon1) * Math.PI/180

const a =
Math.sin(Δφ/2) * Math.sin(Δφ/2) +
Math.cos(φ1) * Math.cos(φ2) *
Math.sin(Δλ/2) * Math.sin(Δλ/2)

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

return R * c
}

function showModal(location){

title.textContent = location.name
text.textContent = location.info

modal.classList.remove("hidden")

}

function checkLocations(userLat,userLng){

locations.forEach(loc=>{

const d = distance(userLat,userLng,loc.lat,loc.lng)

if(d < loc.radius && !triggered[loc.name]){

triggered[loc.name] = true
showModal(loc)

}

})

}

function success(position){

const lat = position.coords.latitude
const lng = position.coords.longitude
const accuracy = position.coords.accuracy

statusText.textContent =
"Accuracy: " + Math.round(accuracy) + "m"

if(accuracy > REQUIRED_ACCURACY){

statusText.textContent += " (waiting for GPS lock...)"

return
}

statusText.textContent =
"GPS locked | Accuracy: " + Math.round(accuracy) + "m"

checkLocations(lat,lng)

}

function error(err){
statusText.textContent = "Location error: " + err.message
}

navigator.geolocation.watchPosition(
success,
error,
{
enableHighAccuracy: true,
maximumAge: 0,
timeout: 10000
}
)

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js")
}

const gpsIndicator = document.getElementById("gps-indicator")
const gpsStatus = document.getElementById("gps-status")
const accuracyText = document.getElementById("accuracy")

function success(position){

const lat = position.coords.latitude
const lng = position.coords.longitude
const accuracy = position.coords.accuracy

accuracyText.textContent = "Accuracy: " + Math.round(accuracy) + " meters"

if(accuracy > REQUIRED_ACCURACY){

gpsStatus.textContent = "Waiting for GPS lock..."
gpsIndicator.classList.remove("locked")
gpsIndicator.classList.add("searching")

return

}

gpsStatus.textContent = "GPS Locked"
gpsIndicator.classList.remove("searching")
gpsIndicator.classList.add("locked")

checkLocations(lat,lng)

}