import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './slices/userSlice';
import { User } from "@/utils/types";

const rootReducer = combineReducers({
  user: userReducer,
  // I might later add these reducers for a persistent state using them, but i expect to implement supabase
  // reviews: reviewsReducer,
  // books: booksReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // I implement redux persist for login only.
  // I expect this might have been an acceptable way to implement other data too,
  // but i expect to use supabase for those
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck:false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// I define some utilities here to make state checking a bit more modular 
export function checkIsLogged(user: User | null): boolean {
  if (!user?.email || !user?.token) return false;
  
  // Check if token is expired
  if (user.expiresAt && user.expiresAt < Math.floor(Date.now() / 1000)) {
    return false;
  }
  
  return true;
}
