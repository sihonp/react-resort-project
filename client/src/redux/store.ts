import { createStore } from 'redux';
import { AppState } from './appState';
import { reduce } from './reducer';

export const store = createStore(reduce, new AppState());