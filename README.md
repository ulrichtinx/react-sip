# Notice

Please note that this is just a version of [react-sip](https://github.com/callthemonline/react-sip)
with pull requests [#27](https://github.com/callthemonline/react-sip/pull/27) and [#28](https://github.com/callthemonline/react-sip/pull/28)
merged. We are primarily hosting it on NPM for our own use, but feel free
to include this in your project if you need any of those features.

All changes are made by [evercall](https://evercall.dk) for our own use,
and we do not provide any kind of support for react-sip.

# React SIP

React wrapper for [jssip](https://github.com/versatica/JsSIP).

## Installation

```bash
npm install @evercall/react-sip
```

There is no need to install `jssip` as it is a dependency of `react-sip`.

## Usage

```js
import { SipProvider } from '@evercall/react-sip';
import App from './components/App';

ReactDOM.render(
  <SipProvider
    host="sip.example.com"
    port={7443}
    pathname="/ws" // Path in socket URI (e.g. wss://sip.example.com:7443/ws); "" by default
    secure={true} // if true, the connection will be made over `wss://` else it will default to `ws://`
    user="alice"
    password={sipPassword} // usually required (e.g. from ENV or props)
    autoRegister={true} // true by default, see jssip.UA option register
    autoAnswer={false} // automatically answer incoming calls; false by default
    iceRestart={false} // force ICE session to restart on every WebRTC call; false by default
    sessionTimersExpires={120} // value for Session-Expires header; 120 by default
    extraHeaders={{ // optional sip headers to send
      register: ['X-Foo: foo', 'X-Bar: bar'],
      invite: ['X-Foo: foo2', 'X-Bar: bar2']
    }}
    iceServers={[ // optional
      { urls: ['stun:a.example.com', 'stun:b.example.com'] },
      { urls: 'turn:example.com', username: 'foo', credential: '1234' }
    ]}
    debug={false} // whether to output events to console; false by default
    incomingAudioDeviceId={"default"} // default, or a deviceId obtained from navigator.mediaDevices.enumerateDevices()
    outboundAudioDeviceId={"default"} // default, or a deviceId obtained from navigator.mediaDevices.enumerateDevices()
    dtmfTransportType={"RFC4733" | "INFO" | "RFC2733"} // DTMF tone transport method
  >
    <App />
  </SipProvider>
  document.getElementById('root'),
);
```

Child components get access to the context by implementing this:

```js
function Child(props, SipProvider) {

  return (
    <h1>{SipProvider.call.status}</h1>
  );
}

Child.contextTypes = SipProvider.childContextTypes;
```

See [lib/types.ts](./src/lib/types.ts) for technical details of what `sipType` and `callType` are.
An overview is given below:

### sip

`sip.status` represents SIP connection status and equals to one of these values:

- `'sipStatus/DISCONNECTED'` when `host`, `port` or `user` is not defined
- `'sipStatus/CONNECTING'`
- `'sipStatus/CONNECTED'`
- `'sipStatus/REGISTERED'` after calling `registerSip` or after `'sipStatus/CONNECTED'` when `autoRegister` is true
- `'sipStatus/ERROR'` in case of configuration, connection or registration problems

`sip.errorType`:

- `null` when `sip.status` is not `'sipStatus/ERROR'`
- `'sipErrorType/CONFIGURATION'`
- `'sipErrorType/CONNECTION'`
- `'sipErrorType/REGISTRATION'`

`sip.host`, `sip.port`, `sip.user`, `...` – `<SipProvider />`’s props (to make them easy to be displayed in the UI).

### call

`call.id` is a unique session id of the actual established voice call; `undefined` between calls

`call.status` represents the status of the call:

- `'callStatus/IDLE'` between calls (even when disconnected)
- `'callStatus/STARTING'` active incoming or outgoing call request
- `'callStatus/ACTIVE'` during ongoing call
- `'callStatus/STOPPING'` during call cancelation request

`call.direction` indicates the direction of the ongoing call:

- `null` between calls
- `'callDirection/INCOMING'`
- `'callDirection/OUTGOING'`

`call.counterpart` represents the call _destination_ in case of outgoing call and _caller_ for
incoming calls.
The format depends on the configuration of the SIP server (e.g. `"bob" <+441234567890@sip.example.com>`, `+441234567890@sip.example.com` or `bob@sip.example.com`).

### methods

When `autoRegister` is set to `false`, you can call `sipRegister()` and `sipUnregister()` manually for advanced registration scenarios.

To make calls, simply use these functions:

- `answerCall()`
- `startCall(destination)`
- `stopCall()`

The value for `destination` argument equals to the target SIP user without the host part (e.g. `+441234567890` or `bob`).
The omitted host part is equal to host you’ve defined in `SipProvider` props (e.g. `sip.example.com`).

During a call you can put it on hold using the `call.hold()` and `call.unhold()` functions. You can also get hold status with the `call.isOnHold` property.

You may also mute your microphone during calls with the `call.toggleMuteMicrophone()`, `call.muteMicrophone` and `call.unmuteMicrophone` methods.
You can check whether the microphone is used with the `call.microphoneIsMuted` property.

To send DTMF tones while in-call, you can use this function:

`sendDTMF(tones)`

You can pass as many tones as you want in a `string` (e.g. `sendDTMF("1234")`).
You may also specify `duration` and `interToneGap` in milliseconds, as `sendDTMF("1234", 100, 70)`. See [the MDN docs for `RTCDTMFSender.insertDTMF()`](https://developer.mozilla.org/en-US/docs/Web/API/RTCDTMFSender/insertDTMF) for further details.

The DTMF implementation is **not** SIP INFO, but [RFC-4733](https://tools.ietf.org/html/rfc4733).

---

The values for `sip.status`, `sip.errorType`, `call.status` and `call.direction` can be imported as constants to make typos easier to detect:

```js
import {
  SIP_STATUS_DISCONNECTED,
  //SIP_STATUS_...,
  CALL_STATUS_IDLE,
  //CALL_STATUS_...,
  SIP_ERROR_TYPE_CONFIGURATION,
  //SIP_ERROR_TYPE_...,
  CALL_DIRECTION_INCOMING,
  CALL_DIRECTION_OUTGOING,
} from "react-sip";
```

Custom PropTypes types are also provided by the library:

```js
import { callType, extraHeadersType, iceServersType, sipType } from "react-sip";
```
