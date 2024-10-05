# Today starts it all

## Install TypeScript

```sh
npm i -D typescript
npm install -D ts-node
```

## Install the needed types for other frameworks and libraries

```sh
npm install @types/express --save-dev
npm install --save-dev @types/morgan
npm install --save-dev @types/cookie-parser
```

## Response format:

```js
const response: Record<string, unknown> = {
  state: "'success' or 'error'",
  data: "The requested data",
  message: "A message",
};
```
