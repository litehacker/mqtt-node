import { connect } from "mqtt"; // import connect from mqtt
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const client = connect("mqtt://" + process.env.MQTT_SERVER_URL); // create a client
const _topic = process.env.TOPICTOREAD;
const data = `{"operationType":"check","content":{"version":"00000001"}}`;
const data1 = `{"operationType":"update","content":{"status":"ok"}}`;

if (!_topic) {
  throw new Error("No env file");
}
client.on("connect", function () {
  setInterval(() => {
    console.log(data);
    client.publish(_topic, data);
  }, 3000);
});
