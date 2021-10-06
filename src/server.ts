import bodyParser from "body-parser";
import helmet from "helmet";
import App from "./app";
import HomeController from "./controllers/home.controller";

const app = new App({
  port: 3000,
  controllers: [new HomeController()],
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    helmet(),
  ],
});

app.listen();
