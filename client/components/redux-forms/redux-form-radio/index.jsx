/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

/**
 * Internal dependencies
 */
import FormRadio from 'wp-calypso-client/components/forms/form-radio';

import 'wp-calypso-client/state/form/init';

const RadioRenderer = ( { input, meta, type, ...props } ) => (
	<FormRadio { ...input } { ...props } />
);

const ReduxFormRadio = ( props ) => <Field component={ RadioRenderer } type="radio" { ...props } />;

ReduxFormRadio.propTypes = {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
};

export default ReduxFormRadio;
