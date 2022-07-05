import {
  createSlice,
  createEntityAdapter,
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';
import { SettingsTable } from '../../types/settings-table';

const settingsAdapter = createEntityAdapter<SettingsTable>({});
export const settingsSlice = createSlice({
  name: 'filters',
  initialState: settingsAdapter.getInitialState(),
  reducers: {
    settingsInit: settingsAdapter.getInitialState,
    settingsAutoInit: settingsAdapter.addOne,
    settingsUpdate: settingsAdapter.upsertOne,
  },
});
export const { actions } = settingsSlice;
export const factsReducer = (state: RootState) => state.facts;
export default settingsSlice.reducer;

export const factsSelector = settingsAdapter.getSelectors<RootState>(
  (state) => state.settings
);
export const getSettings = () => {
  return factsSelector.selectById(store.getState(), 1);
};
export const effect1 = createListenerMiddleware();
effect1.startListening({
  matcher: isAnyOf(actions.settingsInit),
  effect: async () => {
    const settings = {
      id: 1,
      hoverInfo: localStorage.getItem('hoverInfo') === `true` ? true : false,
      position: localStorage.getItem('position') === `top` ? `top` : `center`,
      allFacts: localStorage.getItem('allFacts') === `true` ? true : false,
      '#tagged-data': localStorage.getItem('#tagged-data') || `#FF6600FF`,
      '#search-results': localStorage.getItem('#search-results') || `#FFD700FF`,
      '#selected-fact': localStorage.getItem(`#selected-fact`) || `#003768FF`,
      '#tag-shading': localStorage.getItem(`#tag-shading`) || `#ff00004d`,
    };
    //updateCSSVariables();
    store.dispatch(actions.settingsUpdate(settings));
  },
});

export const effect2 = createListenerMiddleware();
effect1.startListening({
  matcher: isAnyOf(actions.settingsUpdate),
  effect: async (action) => {
    Object.keys(action.payload).forEach((current) => {
      localStorage.setItem(current, action.payload[current]);
    });
    updateCSSVariables();
  },
});

const updateCSSVariables = () => {
  document.documentElement.style.setProperty(
    '--tagged-data',
    localStorage.getItem('#tagged-data') || `#FF6600FF`,
    `important`
  );
  document.documentElement.style.setProperty(
    '--search-results',
    localStorage.getItem('#search-results') || `#FFD700FF`
  );
  document.documentElement.style.setProperty(
    '--selected-fact',
    localStorage.getItem(`#selected-fact`) || `#003768FF`
  );
  document.documentElement.style.setProperty(
    '--tag-shading',
    localStorage.getItem(`#tag-shading`) || `#ff00004d`
  );
};
