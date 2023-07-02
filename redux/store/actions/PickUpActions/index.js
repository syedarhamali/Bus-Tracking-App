function addPickUpLocation(pickuplocation) {
    return {
        type: 'ADD_PICKUP_LOCATION',
        data: pickuplocation
    }
}

function removePickUpLocation() {
    return {
        type: 'REMOVE_PICKUP_LOCATION'
    }
}

export {
    addPickUpLocation,
    removePickUpLocation
}
