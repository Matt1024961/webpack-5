import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import type { RootState } from '..';
import store from '..';
import { FormInformationTable } from '../../types/form-information';

const infoAdapter = createEntityAdapter<FormInformationTable>({});
export const infoSlice = createSlice({
    name: 'filters',
    initialState: infoAdapter.getInitialState(),
    reducers: {
        infoInit: infoAdapter.addOne,
    },
});
export const { actions } = infoSlice;
export const infoReducer = (state: RootState) => state.info;
export default infoSlice.reducer;

export const infoSelector = infoAdapter.getSelectors<RootState>(
    (state) => state.info
);

export const getFormInformation = () => {
    return infoSelector.selectById(store.getState(),1);
  };
