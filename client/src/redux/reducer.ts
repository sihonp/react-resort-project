import { Action } from './action'
import { ActionType } from './actionType';
import { AppState } from './appState';

export function reduce(oldState: AppState, action: Action): AppState {

    const newState = { ...oldState };

    switch (action.type) {

        case ActionType.updateResortsArray:
            newState.resorts = action.payload;
            break;

        case ActionType.deleteResort:
            newState.resorts = action.payload;
            break;

        case ActionType.refreshModal:
            newState.refreshModal = !action.payload;
            break;

        case ActionType.sendResort:
            newState.sendResort = action.payload;
            break;

    }

    return newState;
}