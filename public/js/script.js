const socket = io();//connection request goes to server


//io = receive emit = send
if(navigator.geolocation){//check if the browser supports geolocation
    navigator.geolocation.watchPosition((position)=>{//watch the position 
        const {latitude, longitude} = position.coords;
        socket.emit('send-location', {latitude, longitude})
    }, (error)=>{
        console.log(error);
    },
    {
        enableHighAccuracy: true,//watchposition settings
        timeout:5000,
        maximumAge: 0,//Caching off
    }
)
}

const map = L.map("map").setView([0,0],10)//asking for map, sets the viewport and zoomlevel

//gives the actual map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Raunak's Map"
}).addTo(map)

const markers = {}

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude])
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude])
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
})

socket.on('user-disconnect', (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id];
    }
})