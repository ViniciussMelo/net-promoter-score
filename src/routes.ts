import { Router } from 'express';
import { UserController } from "./controllers/UsersController";
import { SurveysController } from './controllers/SurveysController';

const router = Router();

const usersController = new UserController();
const surveysController = new SurveysController();

router.post("/users", usersController.create);

router.post("/surveys", surveysController.create);
router.get("/surveys", surveysController.show);

export { router };