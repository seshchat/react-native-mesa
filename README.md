# react-native-mesa
[Mesa](https://github.com/crybapp/mesa) component for React Native, utilising [mesa-js-client](https://github.com/neoncloth/mesa-js-client)

## Installation
This module library is available on the [NPM registry](https://www.npmjs.com/package/react-native-mesa). To install, run:
```bash
npm i react-native-mesa --save
```
If you're using [Yarn](https://yarnpkg.com), run:

```bash
yarn add react-native-mesa
```

## Setup
There are two ways you can setup `react-native-mesa` in your project.

If you just want to use it in a simple application, follow the Basic Usage example. If you want to use `react-native-mesa` in a more complex manor, such as being able to send messages from multiple components, follow the Advanced Usage example

### Basic Usage
`react-native-mesa` is incredibly easy to setup for basic usage. Below is an example of how to get going:
```jsx
import Mesa from 'react-native-mesa'

function App() {
  function onConnected() {
    console.log('Connected to Mesa')
  }

  function onMessage(opcode: number, data: any, type: string) {
    console.log('Recieved', opcode, data, type)
  }

  function onDisconnected() {
    console.log('Disconnected from Mesa')
  }

  function onError(error) {
    console.log('Mesa error occured', error)
  }

  return (
    <Fragment>
      <Mesa
        url="ws://localhost:4000"
        
        onConnected={onConnected}
        onDisconnected={onDisconnected}

        onMessage={onMessage}
        onError={onError}
      />
    </Fragment>
  )
}
```

#### Authentication
`react-native-mesa` support authentication. Simply pass the component an `authorization` object containing whatever you need for your Mesa client to be authenticated with your server:
```jsx
<Mesa
  url="ws://localhost:4000"
  authorization={{ token: fetchToken() }}
/>
```

Your client will sent the authorization message as soon as it makes a connection

### Advanced Usage
If you wish to use `react-native-mesa` in multiple components, requires a little bit of setup in your project to get going.

Firstly, wrap your top-level component with `<MesaProvider />`.

*Note: `<MesaProvider />` takes in the exact same props as the `<Mesa />` component from the example above.*

```jsx
import { MesaProvider } from 'react-native-mesa'

function App() {
  function onConnected() {
    console.log('Connected to Mesa')
  }

  function onMessage(opcode: number, data: any, type: string) {

  }

  function onDisconnected() {
    console.log('Disconnected from Mesa')
  }

  function onError(error) {
    console.log('Mesa error occured', error)
  }

  return (
    <MesaProvider
      url={getGatewayUrl()}

      onConnected={onConnected}
      onDisconnected={onDisconnected}

      onMessage={onMessage}
      onError={onError}>
      <MessageList />
      <MessageBar />
    </MesaProvider>
  )
}
```

*Note: MesaProvider doesn't have to be the very, very top level component but high enough in the hierarchy to cover any components you want to send messages from.*

Any components you want to send messages from have to be located (not directly) inside of `<MesaProvider />`.

You then need to connect your component with `connectMesa`. After this is completed, you can send a message using `Props.sendMessage`:
```jsx
import { connectMesa } from 'react-native-mesa'

function MessageBar({ sendMessage }) {
  function onSend(content) {
    sendMessage({
      opcode: 0,
      data: { content },
      type: 'NEW_MESSAGE'
    })
  }

  return <Input onSend={onSend} />
}

const ConnectedMessageBar = connectMesa(MessageBar)

export default ConnectedMessageBar
```

If you're using React 16.8, you can use a Hook instead of a higher order component:
```tsx
import { useMesa } from 'react-native-mesa'

export default function MessageBar({ sendMessage }) {
  const { sendMessage } = useMesa()

  function onSend(content) {
    sendMessage({
      opcode: 0,
      data: { content },
      type: 'NEW_MESSAGE'
    })
  }

  return <Input onSend={onSend} />
}
```

## Questions / Issues
If you have an issues with `react-native-better-image`, please either open a GitHub issue or contact a maintainer
