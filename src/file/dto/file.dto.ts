export class FileDto {
  constructor(
    public name: string,
    public mimetype: string,
    public data: number[],
  ) {}
}
