import { RootState } from '../store/types';
import { EditorState } from './types';

export const getState = (state: RootState): EditorState => state.editor;
