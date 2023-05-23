# mqtt-node

Test example to run subscriber and publisher mqtt nodes if broker is created already.

1. Replace the value of `MQTT_SERVER_URL` in `.env` file that should be in the root directory. And replace the url to post `FIREBASE_URL` in `.env`.
2. `npm i` from root
3. `npx ts-node .\src\publisher.ts` to start publisher, `npx ts-node .\src\serverMQTTsubscriber.ts` to start subscriber.
