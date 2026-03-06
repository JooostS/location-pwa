const REQUIRED_ACCURACY = 25

const gpsStatus = document.getElementById("gps-status")
const accuracyText = document.getElementById("accuracy")

const modal = document.getElementById("modal")
const title = document.getElementById("modal-title")
const text = document.getElementById("modal-text")
const closeBtn = document.getElementById("close")

closeBtn.onclick = () => modal.classList.add("hidden")

let triggered = {}

let map = L.map("map").setView([0,0], 18)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
maxZoom:19
}).addTo(map)

let userMarker = null

/* draw geofence circles */

locations.forEach(loc=>{

L.circle([loc.lat,loc.lng],{
radius:loc.radius,
color:"blue",
fillOpacity:0.2
}).addTo(map)

})

function distance(lat1, lon1, lat2, lon2){

const R = 6371000

const φ1 = lat1 * Math.PI/180
const φ2 = lat2 * Math.PI/180
const Δφ = (lat2-lat1) * Math.PI/180
const Δλ = (lon2-lon1) * Math.PI/180

const a =
Math.sin(Δφ/2)*Math.sin(Δφ/2)+
Math.cos(φ1)*Math.cos(φ2)*
Math.sin(Δλ/2)*Math.sin(Δλ/2)

const c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))

return R*c

}

function showModal(loc){

title.textContent = loc.name
text.textContent = loc.info

modal.classList.remove("hidden")

}

function checkLocations(lat,lng){

locations.forEach(loc=>{

const d = distance(lat,lng,loc.lat,loc.lng)

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

accuracyText.textContent =
"Accuracy: "+Math.round(accuracy)+"m"

if(accuracy > REQUIRED_ACCURACY){

gpsStatus.textContent = "Waiting for GPS lock..."
return

}

gpsStatus.textContent = "GPS locked"

map.setView([lat,lng],18)

if(!userMarker){

userMarker = L.marker([lat,lng]).addTo(map)

}else{

userMarker.setLatLng([lat,lng])

}

checkLocations(lat,lng)

}

function error(){

gpsStatus.textContent = "Location permission denied"

}

navigator.geolocation.watchPosition(

success,
error,
{
enableHighAccuracy:true,
maximumAge:0,
timeout:10000
}

)

if("serviceWorker" in navigator){

navigator.serviceWorker.register("service-worker.js")

}