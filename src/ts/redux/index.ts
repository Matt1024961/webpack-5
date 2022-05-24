import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './reducers';
import factsReducer from './reducers/facts';
//import filtersReducer from './reducers/filters';
import settingsReducer from './reducers/user-settings';

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    example: counterSlice,
    settings: settingsReducer,
    facts: factsReducer,
    //filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: { warnAfter: 512 },
    serializableCheck: { warnAfter: 512 },
  })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

