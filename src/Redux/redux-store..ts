import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { 
  persistReducer, 
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import registerReducer from "./slices/authSlice";
import loginReducer from "./slices/loginSlice";
import adminLogin from "./slices/adminSlice";

const persistConfig = {
  key: "root",
  version: 1, // Useful for migrations
  storage,
  whitelist: ["login", "adminLogin"], // Ensure these match combineReducers keys
  // Optional: You can add blacklist for reducers you don't want to persist
};

const rootReducer = combineReducers({
  auth: registerReducer,
  login: loginReducer,
  adminLogin: adminLogin,
  // Add other reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Optionally ignore specific paths if needed
        // ignoredPaths: ['some.nested.path']
      },
    }),
  // Enable Redux DevTools in development
  // devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;