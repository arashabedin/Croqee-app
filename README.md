# Croqee-app
A very cool app that helps drawing/illustration artists to achieve great skills
bla bla

-For Local development: Start the app, cd to server folder and run "npm run dev".
it should start both client and express server.

-For development using Docker containers: on a docker installed machine, run "docker-compose up" on root folder.


-To run Docker Production image: Run "docker-compose -f docker-compose.prod.yml up".

Note: if you wanna switch back from docker development to local development, you have to change the proxy in client/package.json from "http://server:8080" to "http://localhost:8080" and run the local development step.

