import { Request, Response } from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import NpsService from '../services/NpsService';

/**
 * Calc NPS:
 * 1 2 3 4 5 6 7 8 9 10
 * Detractors => 0 - 6;
 * Passives => 7 - 8; (does'nt metter)
 * Promoters => 9 - 10;
 * 
 * Formúla: (Nº de promotores - Nº de detratores) / (Nº de respondentes) * 100
 */

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveysUser = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractors = surveysUser.filter(survey => (survey.value >= 0 && survey.value <= 6)).length;
    const passives = surveysUser.filter(survey => (survey.value >= 7 && survey.value <= 8)).length;
    const promoters = surveysUser.filter(survey => (survey.value >= 9 && survey.value <= 10)).length;
    const totalAnswers = surveysUser.length;

    const calculate = NpsService.calculate(detractors, promoters, totalAnswers);

    return response.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: calculate
    });
  }
}

export { NpsController }