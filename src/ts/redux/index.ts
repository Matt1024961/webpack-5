import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './reducers';
import factsReducer from './reducers/facts';
import filtersReducer, { effect1, effect2 } from './reducers/filters';
import sectionsReducer from './reducers/sections';
import settingsReducer, {
  effect1 as settingsEffect,
} from './reducers/user-settings';
import infoReducer from './reducers/form-information';

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    example: counterSlice,
    settings: settingsReducer,
    facts: factsReducer,
    filters: filtersReducer,
    sections: sectionsReducer,
    info: infoReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 512 },
      serializableCheck: { warnAfter: 512 },
    }).prepend([
      effect1.middleware,
      effect2.middleware,
      settingsEffect.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
