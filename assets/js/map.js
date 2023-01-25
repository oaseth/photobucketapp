mapboxgl.accessToken = 'pk.eyJ1Ijoib2FzZXRoIiwiYSI6ImNsOHVkMnJzbjAyejczdG9mamRkN2N2dGsifQ.R_vJ7BzZeOijwyHq0XovBQ';

var map
var mapinit = () => {
    map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [-74.5, 40], // starting position [lng, lat]
        zoom: 9, // starting zoom
    });
    feedData()
}

// A function to plot the coordinates of the photo as a marker on the map with a popup. 
var feedData = () => {
    fetch("https://photobucketapp-b9956-default-rtdb.firebaseio.com/feed.json")
        .then(response => {
            return response.json()
        }).then(data => {
            var bounds = new mapboxgl.LngLatBounds()

            var ids = Object.keys(data)
            ids.forEach(id => {
                var long = data[id].location.longitude
                var lat = data[id].location.latitude
                var coords = [long, lat]
                var popup = new mapboxgl.Popup()
                    .setHTML('<p> <strong>Status : </strong> ' + data[id].status + '</p> <br> <img src= ' + data[id].image + '> <br> <br><p> <strong>Email :</strong>' + data[id].email + '</p>')
                new mapboxgl.Marker()
                    .setLngLat(coords)
                    .setPopup(popup)
                    .addTo(map)
                // console.log(coords)
                bounds.extend(coords)
            })
            map.fitBounds(bounds)
        })

}
