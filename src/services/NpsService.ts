import { Double } from "typeorm";

class NpsService {
  calculate(detractors: number, promoters: number, totalAnswers: number): Double {

    const calc = ((promoters - detractors) / totalAnswers) * 100;

    return Number(calc.toFixed(2));
  }
}

export default new NpsService();