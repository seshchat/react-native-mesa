import * as React from 'react'

import { Message } from 'mesa-js-client/dist/module/defs'

import { MesaProps } from './types'

const context = React.createContext<MesaProps>({
	sendMessage: (message: Message) => {}
})

export function useMesa() {
	return React.useContext(context)
}

const { Provider, Consumer } = context

export { Provider, Consumer }
