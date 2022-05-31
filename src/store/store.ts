import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

const configStore = (initialState = {}) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    devTools: process.env.APP_ENV !== 'production'
  })

  return store
}

export default configStore
