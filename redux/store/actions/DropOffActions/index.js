function addDropOffLocation(dropofflocation) {
    return {
        type: 'ADD_DROPOFF_LOCATION',
        data: dropofflocation
    }
}

function removeDropOffLocation() {
    return {
        type: 'REMOVE_DROPOFF_LOCATION'
    }
}

export {
    addDropOffLocation,
    removeDropOffLocation
}
