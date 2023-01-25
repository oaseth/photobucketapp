var canvas = document.getElementById('capturedImg')
var userLocation
// Ask the user to turn on the GPS
var geoRecall = true

var progressBar = document.getElementById('imgUploadProgress')


// A function to check if a canvas is empty
function isCanvasEmpty(cs) {
    const blankCanvas = document.createElement('canvas');
    blankCanvas.width = cs.width;
    blankCanvas.height = cs.height;
    return cs.toDataURL() === blankCanvas.toDataURL();
}


// A function to add an image to be posted on the modal canvas
// function addImgToCanvas(e) {
var addImgToCanvas = (e) => {
    var reader = new FileReader()
    reader.onload = (event) => {
        var img = new Image()
        img.onload = () => {
            var ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, 240, 320)
        }
        img.src = event.target.result
    }
    reader.readAsDataURL(e.files[0])
}

// A function to show the location of the user
function showPosition(location) {
    if (isCanvasEmpty(canvas)) {
        document.getElementById('location_info').innerHTML = "<strong> No photo is added yet!</strong>"
        $('#location_info').css("color", "red")
    } else {
        document.getElementById('location_info').innerHTML = "<strong>Location data acquired! Saving the post</strong>"
        $('#location_info').css("color", "green")

        userLocation = {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude
        }
        console.log(userLocation)
        submitPost(userLocation)
        geoRecall = false
    }
}

// A function to display an error message if the user's gps location can't be accessed
function positionError() {
    document.getElementById('location_info').innerHTML = "!! Please turn on your GPS !!"
    $('#location_info').css("color", "red")
    userLocation = undefined
    if (geoRecall) {
        navigator.geolocation.getCurrentPosition(showPosition, positionError)
    }
}

// A function to get location of a user and display a message to request for the GPS 
// access if the location data is restricted 
function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition, positionError)
}


// A function to post a photo and its geolocation property
function submitPost(location) {
    canvas.toBlob(function (blob) {
        var name = currentUsersEmail + "_" + new Date().toISOString()
        var storageRef = firebase.storage().ref('feed/' + name)

        var upload = storageRef.put(blob)
        progressBar.parentElement.style.display = "flex"
        upload.on("state_changed",
            (photoData) => {
                var progressPercent = (photoData.bytesTransferred / photoData.totalBytes) * 100
                progressBar.style.width = progressPercent + "%"
            }, (error) => {
                console.log(error)
            }, () => {
                progressBar.parentElement.style.display = 'none'
                progressBar.style.width = "0%"
            })

        upload.then(photoData => photoData.ref.getDownloadURL())
            .then(url => {
                console.log(url)
                fetch("https://photobucketapp-b9956-default-rtdb.firebaseio.com/feed.json", {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        "email": currentUsersEmail,
                        "status": document.getElementById('emotion').value,
                        "image": url,
                        "location": location,
                        "time": new Date().toISOString()
                    })
                }).then(res => {
                    console.log("Entry added successfully!")
                    var ctx = canvas.getContext('2d')
                    ctx.clearRect(0, 0, 240, 320)
                    document.getElementById('emotion').value = ""
                    document.getElementById('location_info').innerHTML = ""
                    $('#newupload').modal('hide')
                }).catch(error => {
                    console.log(error)
                })
            })
    })
}