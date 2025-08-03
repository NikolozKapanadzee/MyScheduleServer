import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDto {
  @IsISO8601()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  getTotalHours(): number {
    const startDate = new Date(`${this.date}T${this.startTime}`);
    const endDate = new Date(`${this.date}T${this.endTime}`);
    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }
    const diffMs = endDate.getTime() - startDate.getTime();
    return diffMs / (1000 * 60 * 60);
  }
  get totalHours(): number {
    return this.getTotalHours();
  }
}
