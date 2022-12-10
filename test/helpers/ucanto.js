/** @param {import('@ucanto/server').ServerView} server */
export function createHTTPListener (server) {
  /** @type {import('http').RequestListener} */
  return async (request, response) => {
    const chunks = []
    for await (const chunk of request) {
      chunks.push(chunk)
    }

    const { headers, body } = await server.request({
      // @ts-ignore
      headers: request.headers,
      body: Buffer.concat(chunks)
    })

    response.writeHead(200, headers)
    response.write(body)
    response.end()
  }
}
