export class AppError {
  public readonly message: string;
  public readonly statusCode: number;

  constructor(messgae: string, statusCode = 400) {
    this.message = messgae;
    this.statusCode = statusCode;
  }
}