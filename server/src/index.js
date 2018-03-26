const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.surveys({ where: { isPublished: true } }, info)
    },
    drafts(parent, args, ctx, info) {
      return ctx.db.query.surveys({ where: { isPublished: false } }, info)
    },
    survey(parent, { id }, ctx, info) {
      return ctx.db.query.survey({ where: { id: id } }, info)
    },
  },
  Mutation: {
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createSurvey(
        { data: { title, text, isPublished: false } },
        info,
      )
    },
    deleteSurvey(parent, { id }, ctx, info) {
      return ctx.db.mutation.deleteSurvey({where: { id } }, info)
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updateSurvey(
        {
          where: { id },
          data: { isPublished: true },
        },
        info,
      )
    },
    rate(parent, { id, rating }, ctx, info) {
      return ctx.db.mutation.createRating(
        {
          data: {
            survey: {
              connect: {
                id: id
              }
            },
            rating,
          },
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/apollo-nps-collector/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
