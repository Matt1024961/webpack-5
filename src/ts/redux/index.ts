import { configureStore } from '@reduxjs/toolkit';
import factsReducer from './reducers/facts';
import filtersReducer, {
  effect1 as filtersEffect1,
  effect2 as filtersEffect2,
} from './reducers/filters';
import sectionsReducer from './reducers/sections';
import settingsReducer, {
  effect1 as settingsEffect1,
} from './reducers/user-settings';
import infoReducer from './reducers/form-information';
import urlReducer from './reducers/url';

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    settings: settingsReducer,
    facts: factsReducer,
    filters: filtersReducer,
    sections: sectionsReducer,
    info: infoReducer,
    url: urlReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 512 },
      serializableCheck: { warnAfter: 512 },
    }).prepend([
      filtersEffect1.middleware,
      filtersEffect2.middleware,
      settingsEffect1.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
