# WebSocket
The `WebSocket` protocol, provides a way to exchange data between browser and server via a persistent connection. The data can be passed in both directions as "**packets**", without breaking the connection and the need of additional HTTP-requests. ( Online Games, Real-time trading systems... )

### A simple example
To open a websocket connection, we need to create `new WebSocket` using the special protocol `ws` in the url: 

`let socket = new WebSocket("ws://javascript.info");`

There's also encrypted `wss://` protocol. It's like **HTTPS** for websockets.

**Note :❗❗❗** 
**Always prefer `wss://`**
The `wss://` protocol is not only encrypted, but also **more reliable.**
That's because `ws://` data is not encrypted, visible for any intermediary.
On the other hand, `wss://` is WebSocket **TLS** (same as HTTPS over TLS), the transport security layer **encrypts the data at the sender and decrypts it at the receiver.** 

----
Once the socket is created, we should listen to events on it. There are totally 4 events.

 - **`open`** -- connection established,
 - **`message`** -- data received,
 - **`error`** -- websocket error,
 - **`close`** -- connection closed.

we'd like to send something, then **`socket.send(data)`** will do that.

**Example - 1** 

- [ open ] Connection established
- Sending to  Server
- [message] Data received from server: Hello from server, Tolga! 
- [close] Connection closed cleanly, code=1000 reason=Bye!

`open` --> `message` --> `close`

![enter image description here](https://i.ibb.co/9yB6SPz/carbon.png)

 
 --- 
 # Opening a websocket
 When  `new WebSocket(url)` is created, it starts connecting immediately.
 During the connection, the browser (using headers) asks the server: "Do you support Websocket?" And if the server replies "yes", **then talk continues in WebSocket protocol**, which is not HTTP at all.
![enter image description here](https://i.ibb.co/tQMGjFC/we.png)

 ### Example 
 Here's an example of browser headers for a request made by 
 `new WebSocket("wss://javascript.info/chat")`

![enter image description here](https://i.ibb.co/2ShxmHM/carbon-2.png)

 - `Origin` the origin of the client page, e.g. `http://javascript.info`. WebSocket objects are cross-origin by nature. There are no special headers or other limitations. But he `Origin`header is important, as it allows the server to decide whether or not to talk WebSocket with this website.
 - `Connection: Upgrade` -- signals that the client would like to change the protocol.
 - `Upgrade : websocket ` -- the requested protocol is "websocket"
 - `Sec-WebSocket-Key ` -- a random browser-generated key,  used to ensure that the server supports WebSocket protocol. 
 
Note ❗❗: **WebSocket handshake can't be emulated.**
We can't use `XMLHttpRequest` or `fetch`  to make this kind of HTTP-request, because JavaScript is not allowed to set the headers.

If the server agress to switch to WebSocket, it should send code 101 response : 
![enter image description here](https://i.ibb.co/p4Hk26C/carbon-4.png)

Here `Sec-WebSocket-Accept` is `Sec-WebSocket-Key`, recoded using a special algorithm. Upon seeing it, the browser understands that the server really does support the WebSocket protocol.

### Extensions and subprotocols
There may be additional headers `Sec-WebSocket-Extensions` and `Sec-WebSocket-Protocol`that describe extensions and subprotocols.
 

 - `Sec-WebSocket-Extensions : deflate-frame` : means that the browser supports data compression. An extension is something related to transferring the data, functionality that extends the WebSocket protocol. 

 - `Sec-WebSocket-Protocol : soap, wamp` means that we'd like to transfer not just any data, but the data in SOAP or WAMP (" The WebSocket Application Messaging Protocol " ) protocols. 


This optional header is set using the second parameter of `new WebSocket`
`let socket = new WebSocket("wss://javascript.info/chat", ["soap", "wamp"] ) `

**Request**
![enter image description here](https://i.ibb.co/pQ8ZkGr/1.png)

**Response**
![enter image description here](https://i.ibb.co/3FBBMgR/1.png)


# Data Transfer
WebSocket communication consists of "frames" -- **data fragments**, that **can be sent from either side**, and can be of several kinds: 

 - "**text frames**" -- contain text data that parties send to each other.
 - "**binary data frames**" -- contain binary data that parties send to each other.
 - "**ping/pong frames**" -- are used to check the connection, sent from the server, the browser responds to these automatically.
 - there's also "connection close frame" and a few other service frames.

**In the browser, we directly work only with text or binary frames.**

❗❗WebSocket **.send()** method can send either text or binary data.

A call socket.send(body) allows body in string or a binary format, including `Blob` `ArrayBuffer`, etc. No settings are required: just send it out in any format.

❗❗ When we receive the data, text always comes as string. And for binary data, we can choose between `Blob`and `ArrayBuffer` formats. 

That's set by `socket.binaryType` property, it's `"blob"` by default, so binary data comes as `Blob` objects. 

`Blob` is a high-level binary object, it directly integrates with `<a> <img>` and other tags.
But for binary processing, to access individual data bytes, we can change it to `"arraybuffer"` : 

![enter image description here](https://i.ibb.co/CQDKMkc/carbon-5.png)


# Rate limiting 
Imagine, our app is generating a lot of data to send. ❗❗ But the user has a slow network connection, maybe on a mobile internet, outside of a city.
We can call `socket.send(data)` again and again. But the data will be buffered ( stored ) in memory and sent out only as fast as network speed allows.
❗❗❗ The `socket.bufferedAmount` property stores how many bytes remain buffered at this moment, waiting to be sent over the network.
We can examine it to see whether the socket is actually available for transmission.

❗❗❗
![enter image description here](https://i.ibb.co/44qyHZQ/carbon-6.png)


# Connection close
Normally, when a party wants to close the connection ( both browser and server have equal rights ), they send a "connection close frame" with a numeric code and a textual reason.

The method for that is 
` socket.close( [code], [reason] ); `

 - `code` is special WebSocket closing code ( optional )
 - ` reason ` is a string describes the reason of closing ( optional )

Then the other party in the `close` event handler gets the code and the reason
![enter image description here](https://i.ibb.co/3yKfkMT/8.png)

Most common code values: 

 - `1000` -- the default, normal closure (used if no `code` supplied ),
 - `1006` -- no way to set such code manually, indicates that the connection was lost.
 - `1001` -- the party is going away, server is shutting down, or a browser leaves the page,
 - `1009` -- the message is too big to process
 - `1011` -- unexpected error on server,


![enter image description here](https://i.ibb.co/M7c6HY6/te.png)

# Connection state
To get connection state, additionally there's `socket.readyState`property with values :

 - `0` -- "CONNECTING" : the connection has not yet been established,
 - `1` -- "OPEN" : communicating,
 - `2` -- "CLOSING" : the connection is closing,
 - `3` -- "CLOSED" : the connection is closed.
 
 # Summary 
 WebSocket is a modern way to have persistent **browser-server connections**. 
 
 - WebSockets don't have corss-origin limitations.
 - They are well-supported in browsers.
 - Can send/receive string and binary data.

The API is simple.
Methods : 

 - `socket.send(data)`
 - `socket.close( [code], [reason] `

Events : 

 - `open`,
 - `message`,
 - `error`,
 - `close`

WebSocket by itself does not include reconnection, authentication and many other high-level mechanisms. So there are client/server libraries for that, and it's also possible to implement these capabilities manually.

