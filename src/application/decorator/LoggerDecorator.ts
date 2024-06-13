import UseCase from "../usecase/UseCase";

export default class LoggerDecorator implements UseCase {
  constructor(readonly useCase: UseCase) {}

  execute(input: any): Promise<any> {
    console.log(input.userAgent);
    return this.useCase.execute(input);
  }
}
