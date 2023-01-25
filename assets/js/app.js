var deferredPrompt;

if ('serviceWorker' in navigator) {
    console.log('sw can be installed')
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('Service worker is registered')
        })
        .catch((error) => {
            console.log('Error while registering sw', error)
        })
}

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
    return false
})