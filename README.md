# BotFiddle

Quick React/Redux demo project that provides a jsFiddle style bot sandbox.

![](docs/botfiddle-screenshot.png)

## Local Development

Ensure ngrok is running. Paste the URL + `/fb-webhook/` into webhooks.

```sh
npm install

cat <<EOF > env.sh
export APP_ID=1753708654953441
export APP_SECRET=
export PAGE_TOKEN=
export MESSENGER_ID=352007191828560
EOF

. env.sh
supervisor --extensions js,jsx index.js
```
