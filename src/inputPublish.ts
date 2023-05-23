import { connect, Packet, PacketCallback } from "mqtt"; // import connect from mqtt
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config();
const client = connect("mqtts://" + process.env.MQTT_SERVER_URL); // create a client
const _topic = process.env.TOPICTOREAD;
if (!_topic) {
  throw new Error("No env file");
}

// readline.close();
client.on("connect", function () {
  console.log("connected");
  client.subscribe(_topic, function (err) {
    while (true) {
      var prompt = require("prompt-sync")({ sigint: true });
      const input = prompt("message to send:");
      client.publish(_topic, input, (error?: Error, packet?: Packet) => {
        if (!error) {
          console.log(input, "=>", _topic, "|", new Date());
        } else {
          console.log("error mqtt send", error);
        }
      });
    }
  });
});
