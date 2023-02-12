import { createStore } from 'redux'

function mainReducer(state = { users : [] }, action) {
    let newState = JSON.parse(JSON.stringify(state));
    switch (action.type) {
      case 'setUsers':
        newState.users = Object.assign([], action.payload);
        break;
      case 'create':
        newState.users.push(action.payload);
    case 'update':
        let index = newState.users.findIndex((x) => x._id === action.id);
        newState.users[index] = Object.assign({}, action.payload);
    case 'delete':
        let dIndex = newState.users.findIndex((x) => x._id === action.id);
        newState.users.splice(dIndex,1);
      default:
        return newState;
    }
    return newState;
  }

  let store = createStore(mainReducer);

  store.subscribe(() => {
    console.log(store.getState())
  })

  export default store;