import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './reducers';
import factsReducer from './reducers/facts';
import settingsReducer from './reducers/user-settings';
// import { factsReducer } from './reducers/facts';
// import { settingsReducer } from './reducers/user-settings';

const preloadedState = {
  //example: { value: 987 },
  //visibilityFilter: 'SHOW_COMPLETED',
};
const store = configureStore({
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    example: counterSlice,
    settings: settingsReducer,
    facts: factsReducer,
  },
  preloadedState,
});
//console.log(`redux!`);console.log(`redux!`);console.log(`redux!`);console.log(`redux!`);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
