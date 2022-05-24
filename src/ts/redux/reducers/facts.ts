import {
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';


const factsAdapter = createEntityAdapter()
export const factsSlice = createSlice({
  name: 'facts',
  initialState: factsAdapter.getInitialState(),
  reducers: {
    factsAddOne: factsAdapter.addOne,
    factsAddMany: factsAdapter.addMany,
    factsUpdate: factsAdapter.updateOne,
    factsRemove: factsAdapter.removeOne,
  },
});
export const { actions } = factsSlice
export const factsReducer = (state: RootState) => state.facts;
export default factsSlice.reducer;

const factsSelector = factsAdapter.getSelectors<RootState>(
  (state) => state.facts
)


export const allFacts = () => {
  return factsSelector.selectAll(store.getState());
}

export const allActive = () => {
  return factsSelector.selectAll(store.getState()).filter((element: any) => {
    return element.active;
  })
}

export const allActiveCount = () => {
  return factsSelector.selectAll(store.getState()).filter((element: any) => {
    return element.active;
  }).length;
}

export const factsCount = () => {
  return factsSelector.selectAll(store.getState()).length

}



