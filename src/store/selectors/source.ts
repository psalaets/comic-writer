import { RootState } from '../types';

export default (state: RootState): string => state.editor.source;
