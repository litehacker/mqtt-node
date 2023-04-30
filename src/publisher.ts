import { connect } from "mqtt"; // import connect from mqtt
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const client = connect("mqtt://" + process.env.MQTT_SERVER_URL); // create a client

client.on("connect", function () {
  client.subscribe("topic", function (err) {
    // if (!err) {
    setInterval(() => {
      client.publish(
        "liftos08765546789",
        `{"a":"a", "a":"a", "a": "a", "a": "a"}`
      );
    }, 100);
    // }
  });
});
