export default function pickUpReducers(state = {}, action) {
    switch (action.type) {
        case 'ADD_PICKUP_LOCATION': return { ...state, pickupLocation: action.data }
        case 'REMOVE_PICKUP_LOCATION': return { ...state, pickupLocation: null }
        default: return state
    }
}