import { Message } from 'mesa-js-client/dist/module/defs'

export interface MesaProps {
	sendMessage: (message: Message) => void
}
