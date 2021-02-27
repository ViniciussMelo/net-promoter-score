import { EntityRepository, getRepository, Repository } from "typeorm";
import { Survey } from "../models/Survey";

@EntityRepository(Survey)
class SurveysRepository extends Repository<Survey> {
    async surveyExists(id: string): Promise<boolean> {
        const survey = await this.findOne({ id });

        return !!survey;
    }
}

export { SurveysRepository };