import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
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
            throw new AppError('User does not exists');
        }

        const user = await usersRepository.findOne({ email });
        const surveyAlreadyExists = await surveysRepository.surveyExists(survey_id);

        if (!surveyAlreadyExists) {
            throw new AppError('Survey does not exists');
        }

        const survey = await surveysRepository.findOne({ id: survey_id });

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {
                user_id: user.id,
                value: null
            },
            relations: [
                "user",
                "survey"
            ]
        });

        const variables: IMailVariables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            surveyUser_id: "",
            link: process.env.URL_MAIL
        };

        if (surveyUserAlreadyExists) {
            variables.surveyUser_id = surveyUserAlreadyExists.id;

            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);
        variables.surveyUser_id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.status(201).json(surveyUser);
    }
}

export { SendMailController };

