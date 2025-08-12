// é o arquivo que 'liga' a API, é onde o servidor Fastify é criado e configurado para começar a 'ouvir' os pedidos.
/* Conceito aplicado: Node.js e Fastify. O que ele faz: Ele importa a configuração do app.js e usa o método .listen() 
do Fastify para iniciar o servidor. Quando você vê "HTTP Server Running!" no terminal, é por causa dessa linha. 
Ele está pronto para receber requisições. */

import fastify from 'fastify'
import crypto from 'node:crypto'

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

const courses = [
  { id: '1', title: 'Curso de Node.js' },
  { id: '2', title: 'Curso de React' },
  { id: '3', title: 'Curso de React Native' },
]

server.get('/courses', (request, reply) => {
  return reply.send({ courses })
})

server.get('/courses/:id', (request, reply) => {
  type Params = {
    id: string
  }

  const params = request.params as Params
  const courseId = params.id

  const course = courses.find(course => course.id === courseId)

  if (course) {
    return { course }
  }

  return reply.status(404).send()
})
 
server.post('/courses', (request, reply) => {
  type Body = {
    title: string
  }

  const courseId = crypto.randomUUID()

  const body = request.body as Body
  const courseTitle = body.title

  if (!courseTitle) {
    return reply.status(400).send({ message: 'Título obrigatório.' })
  }

  courses.push({ id: courseId, title: courseTitle })

  return reply.status(201).send({ courseId })
})

server.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
