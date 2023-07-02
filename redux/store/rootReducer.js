import { combineReducers } from 'redux'
import pickUpReducers from './reducers/PickUpReducers'
import dropOffReducers from './reducers/DropOffReducers'

export default combineReducers({
    pickUpReducers,
    dropOffReducers
})

