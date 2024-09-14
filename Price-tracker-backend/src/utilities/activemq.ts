import { Client , StompSubscription , IMessage } from '@stomp/stompjs';
Object.assign(global, { WebSocket: require('ws') });
// const subscriptions: { [index: string]: StompSubscription } = {};
let subscriptionsActive = false;
export let client: Client | null = null;
// const QUEUE_PREFIX = "amazon-algoris"
export const wrapperSubs = async (client: Client, destination: string, callback: { (message: any): void; (arg0: any): void; }) => {
    if (!client.active) {
      console.error('Connection not active. Cannot subscribe.');
      return;
    }
  
    client.subscribe(destination, (message: { body: string; }) => {
      const parsedMessage = JSON.parse(message.body);
      callback(parsedMessage);
    });
};
export const initializeActiveMq = async () => {
  try {
    const client = await new Client({
      brokerURL: 'ws://127.0.0.1:61614/ws',
      debug: (str) => {
        // console.log("str::",str)
      },
      reconnectDelay: 5000,
      connectHeaders: {
        login: 'admin',
        passcode: 'admin',
      },
    });

    client.onConnect = () => {
        console.log('activeMQ connected...')
        // // const id = 1234
        // // const prefix = `/queue/${id}`
        // // const destination = prefix
        // // const message = { text: 'Hello, world!' };
        // // // wrapperPub(client,destination,message)
        // // wrapperSubs(client, destination, (message: any) => {
        // //   console.log('Received message:', message);
        // })
    };
    client.activate();
  } catch (e) {
    console.log("error::",e)
  }
}
// export const wrapperPub = async (client: Client, destination: string, message: { text: string; }) => {
//     if (!client.active) {
//       console.error('Connection not active. Cannot publish message.');
//       return;
//     }
  
//     client.publish({
//       destination,
//       body: JSON.stringify(message),
//     });
//   };

// type AddMessageOptions = {
//   queue: string;
//   body: string;
//   headers?: { [index: string]: string };
// };

export const addMessage = async (
    opts: { queue: string; body: string; headers?: { [index: string]: string }; },
    prefixOverride?: string
  ) => {
    if (client) {
      client.publish({
        destination: `/queue/${opts.queue}`,
        body: opts.body,
        headers: {
          'content-type': 'application/json',
          persistent: 'true',
          ...(opts.headers ? opts.headers : {}),
        },
      });
    }
  };
  

export const deactivateActiveMq = () => {
  if (client) {
    client.deactivate();
  }
};
