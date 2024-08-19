import { selectorFamily, atom } from "recoil"
import axios from "axios"
const hosted = import.meta.env.VITE_SERVER_URL + "/user/userName"

export const requestedIdsAtom = atom({
    key: 'requestedIdsAtom',
    default: new Set(),
});

export const userNameSelectorFamily = selectorFamily({
    key: 'userNameSelectorFamily ',

    get: (id) => async ({ get }) => {
        const requestedIds = get(requestedIdsAtom);

        // If the ID has already been requested, return null or existing data
        if (requestedIds.has(id)) {
            return; // or return existing data if stored somewhere
        }

        // Fetch user details if the ID hasn't been requested
        const res = await axios.post(hosted, { id });
        return res.data.userName;
    },
})