import axios from "axios";
import * as cheerio from "cheerio";
import { Request, Response } from "express";
import { addMessage } from "../../utilities/activemq";
import { Client } from "@stomp/stompjs";
import { Product } from "../../models/Product";

Object.assign(global, { WebSocket: require("ws") });

export const saveProductDetails = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const regex = /\/dp\/([A-Z0-9]+)/;
    const match = url.match(regex);

    if (match && match[1]) {
      const asin = match[1];
      const data = { asin };
      await Product.create(data);
      try {
        const client = new Client({
          brokerURL: "ws://127.0.0.1:61614/ws",
          debug: (str) => {
            // console.log("str::",str)
          },
          // reconnectDelay: 5000,
          connectHeaders: {
            login: "admin",
            passcode: "admin",
          },
        });
        client.onConnect = () => {
          // console.log('activeMQ connected...')
          client.publish({
            destination: "tracker",
            body: asin,
            headers: {
              "content-type": "application/json",
              persistent: "true",
              AMQ_SCHEDULED_DElAY: String(5000),
            },
          });
          console.log("Data Published in activeMQ...");
          client.subscribe("tracker", (message) => {
            const receivedData = message.body;
            console.log("message::", receivedData);
          });
        };
        client.activate();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("ASIN not found in the URL.");
    }
  } catch (error) {
    console.log("error", error);
  }
  // try {
  //   const head = {
  //     "User-Agent":
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
  //   };
  //   const url = req.body.url;
  //   const regex = /\/dp\/([A-Z0-9]+)/;
  //   const match = url.match(regex);
  //   const asin = match[1]
  //   const response = await axios.get(url, {
  //     headers: head,
  //   });
  //   const html = response.data;
  //   const $ = cheerio.load(html);
  //   const title: string = $("#productTitle").text().trim();
  //   const Price = $("span.a-offscreen").first().text().split(" ");
  //   const price2: string = Price[0];
  //   const data = { title: title.toString(), price: price2.toString() };
  //   if (asin) {
  //     await Product.create(asin);
  //     console.log("Asin number is saved in Postgres successfully.. :) ");
  //     try {
  //       const client = new Client({
  //         brokerURL: 'ws://127.0.0.1:61614/ws',
  //         debug: (str) => {
  //           // console.log("str::",str)
  //         },
  //         reconnectDelay: 5000,
  //         connectHeaders: {
  //           login: 'admin',
  //           passcode: 'admin',
  //         },
  //       });
  //       client.onConnect = () => {
  //         // console.log('activeMQ connected...')
  //         client.publish({
  //           destination : 'tracker',
  //           body: JSON.stringify(asin),
  //           headers: {
  //             'content-type': 'application/json',
  //             persistent: 'true',
  //             // AMQ_SCHEDULED_DELAY : String(5000)
  //           }

  //         });
  //         console.log('Data Published in activeMQ...')
  //         client.subscribe('tracker', (message) => {
  //           const receivedData = message.body;
  //           console.log("message::",receivedData)
  //         });
  //     };
  //     client.activate();
  //     } catch (error) {
  //       console.log(error)
  //     }
  //     // if (data) {
  //     //   const trackerPublish = await addMessage({
  //     //     body: JSON.stringify(data),
  //     //     queue: 'tracker'
  //     //   })
  //     //   console.log("tracker published ::",trackerPublish)
  //     // } else {
  //     //   console.log("error publishing the data in activeMQ::")
  //     // }
  //   }
  //   // console.log("Product:", data);
  //   // console.log("Wait 1 minute...");

  //   // setTimeout(() => {
  //   //   trackProductWithTimeout(url);
  //   // }, 1 * 60 * 1000);
  //   return data;
  // } catch (error) {
  //   console.error("Error tracking product:", error);
  //   return null;
  // }
};
// get all products
export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const output = await Product.findAll;
    console.log("data::", output);
  } catch (error) {
    console.log("error", error);
  }
};
