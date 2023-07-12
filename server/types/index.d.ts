export interface validatorFunctionType {
  (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void;
}
export interface uploadHandlerType {
  fields: { name: string; maxCount: number }[];
  validationFunction: validatorFunctionType;
  limit: number | null;
}
