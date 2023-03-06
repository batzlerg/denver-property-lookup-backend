export function respond(body: BodyInit | null, init: ResponseInit): Response {
  console.log('request response: ', body, '', JSON.stringify(init));
  const response = new Response(body, init);
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');
  response.headers.set('Access-Control-Allow-Headers', '*');
  return response;
}