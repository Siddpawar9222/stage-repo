import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/dms/profileSlice';
import modalSlice from './reducers/modalSlice';
import headerSlice from './reducers/headerSlice';
import sessionSlice from './reducers/sessionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    modal: modalSlice,
    header: headerSlice,
    session: sessionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const makeStore = () => store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
