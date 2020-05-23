import * as React from 'react'

import Mesa, { MesaProps } from './Mesa'
import { Message } from 'mesa-js-client/dist/module/defs'

import { Provider } from './context'

interface Props extends MesaProps {
	children: React.ReactNode
}

export default class MesaProvider extends React.Component<Props> {
	_mesaRef: React.RefObject<Mesa>

	constructor(props: Props) {
		super(props)
		this._mesaRef = React.createRef()
	}

	getContext = () => {
		return {
			sendMessage: (message: Message) => {
				this._mesaRef.current !== null &&
				this._mesaRef.current.sendMessage(message)
			}
		}
	}

	render() {
		return (
			<Provider value={this.getContext()}>
				<Mesa
					url={this.props.url}
					authorization={this.props.authorization}

					onConnected={this.props.onConnected}
					onDisconnected={this.props.onDisconnected}
					
					onError={this.props.onError}
					onMessage={this.props.onMessage}

					ref={this._mesaRef}
				/>
				{React.Children.only(this.props.children)}
			</Provider>
		)
	}
}
