import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveyUser";

@EntityRepository(SurveyUser)
class SurveysUsersRepository extends Repository<SurveyUser> {
    async surveyByUserExists(user_id: string): Promise<boolean> {
        // Surveys without notes
        const surveyUser = await this.findOne({
            where: [{
                user_id
            }, {
                value: null
            }]
        });

        return !!surveyUser;
    }
}

export { SurveysUsersRepository }