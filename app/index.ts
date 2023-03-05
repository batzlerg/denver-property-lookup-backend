export default {
  port: 3001,
  fetch(request: Request) {
    return new Response("Welcome to Bun!");
  },
};