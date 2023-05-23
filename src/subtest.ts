import axios from "axios";
import { connect } from "mqtt"; // import connect from mqtt
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const client = connect("mqtt://" + process.env.MQTT_SERVER_URL); // create a client
const _topicRead = process.env.TOPICTOREAD;
const _topicPub = process.env.TOPICTOPUBLISH;

if (!_topicRead) {
  throw new Error("No env file");
}
client.on("connect", function () {
  client.subscribe(_topicRead, function (err) {
    if (!err) {
      console.log("connected,_topicRead:", _topicRead, "_topicPub:", _topicPub);
    }
  });
});

client.on("message", function (topic, message) {
  // {
  //   "operationType":"check"
  // }

  // {
  //   "operationType":"payment",
  //   "content":{
  //     "cardID"
  //   }
  // }
  try {
    let time = new Date().getTime();
    const data: { operationType: "check" | "payment"; content?: Object } =
      JSON.parse(message.toString("utf-8"));
    if (data.operationType === "check") {
      console.log("<200, good!");
      if (_topicPub) {
        client.publish(_topicPub, "<200, good!");
      }
    } else if (
      data.operationType === "payment" &&
      data.content &&
      topic === _topicRead
    ) {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process.env.FIREBASE_URL,
        headers: {
          "Content-Type": "text/plain",
        },
        data: data.content,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(
            JSON.stringify(response.status),
            new Date().getTime() - time,
            JSON.stringify(response.data)
          );
          if (_topicPub) {
            client.publish(
              _topicPub,
              "<" +
                JSON.stringify(response.status) +
                "," +
                JSON.stringify(response.data) +
                "!"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    //client.end();
  } catch (e) {
    console.log(e);
  }
});
