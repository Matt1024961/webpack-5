import {
    createSlice,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';


const filtersAdapter = createEntityAdapter()
export const filtersSlice = createSlice({
    name: 'filters',
    initialState: filtersAdapter.getInitialState(),
    reducers: {
        filtersAddOne: filtersAdapter.addOne,
        filtersAddMany: filtersAdapter.addMany,
        filtersUpdate: filtersAdapter.updateOne,
        filtersRemove: filtersAdapter.removeOne,
    },
});
export const { actions } = filtersSlice
export const filtersReducer = (state: RootState) => state.filters;
export default filtersSlice.reducer;

const filtersSelector = filtersAdapter.getSelectors<RootState>(
    (state) => state.filters
)


export const allFilters = () => {
    return filtersSelector.selectAll(store.getState());
}

export const filtersCount = () => {
    return filtersSelector.selectAll(store.getState()).length

}



