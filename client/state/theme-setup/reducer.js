/**
 * Internal dependencies
 */
import {
	THEME_SETUP_REQUEST,
	THEME_SETUP_RESULT,
	THEME_SETUP_TOGGLE_DIALOG,
} from 'wp-calypso-client/state/themes/action-types';
import { withStorageKey } from 'wp-calypso-client/state/utils';

const initialState = {
	active: false,
	isDialogVisible: false,
	result: false,
};

export const themeSetup = ( state = initialState, action ) => {
	switch ( action.type ) {
		case THEME_SETUP_RESULT:
			return { ...state, active: false, result: action.data };
		case THEME_SETUP_REQUEST:
			return { ...state, active: true, result: false };
		case THEME_SETUP_TOGGLE_DIALOG:
			return { ...state, isDialogVisible: ! state.isDialogVisible, result: false };
	}

	return state;
};

export default withStorageKey( 'themeSetup', themeSetup );
