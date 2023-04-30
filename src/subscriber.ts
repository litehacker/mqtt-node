import axios from "axios";
import { connect } from "mqtt"; // import connect from mqtt
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const client = connect("mqtt://" + process.env.MQTT_SERVER_URL); // create a client

client.on("connect", function () {
  client.subscribe("topic", function (err) {
    if (!err) {
      console.log("connected");
    }
  });
});

client.on("message", function (topic, message) {
  // message is Buffer

  if (topic === "topic") {
    let data = message;
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.FIREBASE_URL,
      headers: {
        "Content-Type": "text/plain",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(
          JSON.stringify(response.status),
          new Date().getTime().toLocaleString()
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //client.end();
});
