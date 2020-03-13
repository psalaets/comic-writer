import { RootState } from '../store/types';
import { EditorState } from './types';

export const selectEditorState = (state: RootState): EditorState => state.editor;
