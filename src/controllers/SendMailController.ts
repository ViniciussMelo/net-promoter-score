import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendMailService, { IMailVariables } from '../services/SendMailService';

class SendMailController {
    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRepository.userExists(email);
        if (!userAlreadyExists) {
            return response.status(400).json({
                error: "User does not exists"
            });
        }

        const user = await usersRepository.findOne({ email });
        const surveyAlreadyExists = await surveysRepository.surveyExists(survey_id);

        if (!surveyAlreadyExists) {
            return response.status(400).json({
                error: "Survey does not exists"
            });
        }

        const survey = await surveysRepository.findOne({ id: survey_id });

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
        const variables: IMailVariables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL
        }

        const surveyUserAlreadyExists = await surveysUsersRepository.surveyByUserExists(user.id);

        if (surveyUserAlreadyExists) {
            const surveyUser = await surveysUsersRepository.findOne({
                where: [{
                    user_id: user.id
                }, {
                    value: null
                }],
                relations: [
                    "user",
                    "survey"
                ]
            })
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUser);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);

        return response.status(201).json(surveyUser);
    }
}

export { SendMailController };

