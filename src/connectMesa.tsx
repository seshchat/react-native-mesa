import * as React from 'react'

import hoistNonReactStatic from 'hoist-non-react-statics'

import { Consumer } from './context'
import { MesaProps } from './types'

export default function connectMesa<OwnProps = any>(
	WrappedComponent: React.ComponentType<OwnProps & MesaProps>
) {
	const ConnectedMesa = (props: OwnProps) => {
		return (
			<Consumer>
			{({ sendMessage }) => {
				return (
					<WrappedComponent {...props} sendMessage={sendMessage} />
				)
			}}
			</Consumer>
		)
	}

	return hoistNonReactStatic(ConnectedMesa, WrappedComponent)
}
