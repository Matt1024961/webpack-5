import { faker } from '@faker-js/faker';
import store from "..";
import { FactsTable } from "../../types/facts-table";
import { actions } from "../reducers/facts";

export const enterFactsToStore = () => {
    console.log(faker);
    console.log('here?');
    const singleFact: FactsTable = {
        id: `123`,
        tag: `us-gaap:testingtag`,
        order: 0,
        labels: [],
        isActive: true,
        isHighlight: false
    };
    store.dispatch(actions.factsAddMany([singleFact]));
}