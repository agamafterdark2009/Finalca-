import { defineConfig, loadEnv } from 'vite'

const financeSystemInstruction = `You are Finalca CFO, a professional and encouraging financial education assistant.
Use the provided user context to explain portfolio performance, cash flow, and goal progress in plain language.
Do not provide specific stock picks, guaranteed returns, tax evasion guidance, or licensed financial advice.
For high-stakes decisions, clearly recommend consulting a certified financial professional.
Keep responses concise, structured, and actionable.`

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [{
      name: 'finalca-cfo-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith('/api/cfo')) {
          next()
          return
        }
        if (request.method !== 'POST') {
          response.statusCode = 405
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ error: 'Only POST is supported.' }))
          return
        }

        let rawBody = ''
        request.on('data', chunk => { rawBody += chunk })
        request.on('end', async () => {
          try {
            const body = JSON.parse(rawBody)
            if (!body.message || typeof body.message !== 'string') {
              response.statusCode = 400
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify({ error: 'A message is required.' }))
              return
            }
            if (!env.GEMINI_API_KEY) {
              response.statusCode = 503
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify({ error: 'GEMINI_API_KEY is not configured. Add it to your local environment and restart Vite.' }))
              return
            }

            const geminiResponse = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  systemInstruction: { parts: [{ text: financeSystemInstruction }] },
                  contents: [
                    { role: 'user', parts: [{ text: `User context: ${JSON.stringify(body.context || {})}\n\nQuestion: ${body.message}` }] },
                  ],
                  generationConfig: { temperature: 0.3, maxOutputTokens: 500 },
                }),
              },
            )
            const data = await geminiResponse.json()
            if (!geminiResponse.ok) {
              response.statusCode = geminiResponse.status
              const retryAfter = geminiResponse.headers.get('retry-after')
              if (retryAfter) response.setHeader('Retry-After', retryAfter)
              response.setHeader('Content-Type', 'application/json')
              response.end(JSON.stringify({
                error: data.error?.message || 'The CFO service returned an error.',
                code: data.error?.status || (geminiResponse.status === 429 ? 'QUOTA_EXCEEDED' : 'PROVIDER_ERROR'),
              }))
              return
            }
            const reply = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim()
            if (!reply) throw new Error('The CFO service returned an empty response.')
            response.statusCode = 200
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ reply }))
          } catch (error) {
            response.statusCode = 500
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Unable to contact the CFO service.' }))
          }
        })
      })
    },
    }],
  }
})
