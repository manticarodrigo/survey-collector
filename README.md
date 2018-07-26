## Survey Collector

Packages & Frameworks: `React.js, Node.js, Apollo, Prisma`

This app allows you to create surveys with an NPS rating system. Create a draft, publish it, and begin submitting ratings. You can see the rating history in the survey detail page (click on a survey in the survey feed page).

Installation steps:
  1. Enter repo directory: `cd survey-collector`
  2. Install dependencies: `yarn install`
  3. Change to server directory: `cd server`
  4. Deploy prisma to docker: `prisma deploy`

Deployment steps:
  1. Start local server: `yarn start` (you can now open a Playground at http://localhost:4000)
  2. Change to root directory `cd ..`
  3. Start React app: `yarn start`
  4. Open browser: http://localhost:3000
