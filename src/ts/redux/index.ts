import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './reducers';
import factsReducer from './reducers/facts';
import filtersReducer, { listenerMiddleware } from './reducers/filters';
import sectionsReducer from './reducers/sections';
import settingsReducer from './reducers/user-settings';

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    example: counterSlice,
    settings: settingsReducer,
    facts: factsReducer,
    filters: filtersReducer,
    sections: sectionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 512 },
      serializableCheck: { warnAfter: 512 },
    }).prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
