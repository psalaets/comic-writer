import { createContext } from 'react';
import { RootStore } from '../store';

export const RootStoreContext = createContext<RootStore | null>(null);
