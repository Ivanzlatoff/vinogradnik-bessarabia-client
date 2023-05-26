import { configureStore, combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cartRedux';
import userReducer from './userRedux';
import wishlistReducer from './wishlistRedux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiSlice } from './apiSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const appReducer = combineReducers({ 
  user: userReducer, 
  cart: cartReducer, 
  wishlist: wishlistReducer,
  [apiSlice.reducerPath]: apiSlice.reducer
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logoutSuccess') {
    storage.removeItem('persist:root');
    storage.removeItem('i18nextLng')
    return appReducer(undefined, action)
  };

  return appReducer(state, action);
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
});

export let persistor = persistStore(store);