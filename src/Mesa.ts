import React, { Component } from 'react'
import { AppState } from 'react-native'

import MesaClient from 'mesa-js-client'
import { ConnectionOptions } from 'mesa-js-client/dist/module/defs'

export interface MesaProps {
	url: string
	authorization?: object

	onConnected?: (options: ConnectionOptions) => void
	onDisconnected?: (code: number, reason: string, willAttemptReconnect: boolean) => void

	onError?: (error: Error) => void
	onMessage?: (opcode: number, data: object, type: string, sequence?: number) => void
}

export default class Mesa extends Component {
	state: {
		client: MesaClient
	}

	props: MesaProps

	constructor(props) {
		super(props)

		AppState.addEventListener('change', this.didAppChangeState)
	}

	componentDidMount() {
		const client = new MesaClient(this.props.url)

		client.onConnected = async ({ isInitialConnection, isInitialSessionConnection, isAutomaticReconnection }) => {
			if(this.props.authorization)
				await client.authenticate(this.props.authorization, { shouldSync: !isInitialConnection })

			if(!this.props.onConnected)
				return

			this.props.onConnected({ isInitialConnection, isInitialSessionConnection, isAutomaticReconnection })
		}

		client.onMessage = message => {
			if(!this.props.onMessage)
				return

			this.props.onMessage(message.opcode, message.data, message.type, message.sequence)
		}
		client.onDisconnected = (code, reason, { willAttemptReconnect }) => {
			if(!this.props.onDisconnected)
				return

			this.props.onDisconnected(code, reason, willAttemptReconnect)
		}

		client.onError = error => {
			if(!this.props.onError)
				return

			this.props.onError(error)
		}

		this.setState({ client })
	}

	sendMessage(message) {
		this.state.client.send(message.opcode, message.data, message.type)
	}

	timeout: number

	private didAppChangeState = state => {
		if(!state && !this.state.client)
			return

		if(state === 'active' && this.state.client.ws.readyState !== WebSocket.OPEN)
			this.state.client.connect()
		else if(state === 'background' && this.state.client.ws.readyState === WebSocket.OPEN)
			this.state.client.disconnect(1000)
	}

	componentWillUnmount() {
		if(this.state.client) {
			this.state.client.disconnect(1000)
			this.setState({ client: null })
		}

		AppState.removeEventListener('change', this.didAppChangeState)
	}

	render() {
		return null
	}
}
