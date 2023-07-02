export default function dropOffReducers(state = {}, action) {
    switch (action.type) {
        case 'ADD_DROPOFF_LOCATION': return { ...state, dropOffLocation: action.data }
        case 'REMOVE_DROPOFF_LOCATION': return { ...state, dropOffLocation: null }
        default: return state
    }
}