import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Employee } from '@prisma/client';
import { EmployeeService } from './employee.service';

export type StatisticsRes = {
  min: number;
  max: number;
  mean: number;
};
@Injectable()
export class StatisticsService {
  constructor(
    private prisma: PrismaService,
    private employeeService: EmployeeService,
  ) {}

  async getSSForAll(): Promise<StatisticsRes> {
    // TODO: Optimize query (out of the current scope)
    const res = await this.employeeService.employees({});

    return this.calculateSS(res);
  }

  async getSSForContractors(): Promise<StatisticsRes> {
    // TODO: Optimize query (out of the current scope)
    const res = await this.employeeService.employees({
      where: {
        on_contract: true,
      },
    });

    return this.calculateSS(res);
  }

  async getSSForDepartments(): Promise<StatisticsRes[]> {
    // TODO: Optimize query (out of the current scope)
    const res = await this.prisma.employee.groupBy({
      by: ['department'],
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.values(res).map((employees) => this.calculateSS(employees));
  }

  async getSSForSubDepartments(): Promise<StatisticsRes[]> {
    // TODO: Optimize query (out of the current scope)
    const res = await this.prisma.employee.groupBy({
      by: ['department'],
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return Object.values(res).map((employees) => this.calculateSS(employees));
  }

  calculateSS(employees: Employee[]): StatisticsRes {
    let min = Number(employees[0].salary);
    let max = Number(employees[0].salary);
    let sum = 0;
    for (let i = 0; i < employees.length; i++) {
      const salary = Number(employees[i].salary);
      if (salary < min) {
        min = salary;
      }
      if (salary > max) {
        max = salary;
      }
      sum += salary;
    }

    const mean = sum / employees.length;

    return {
      min,
      max,
      mean,
    };
  }
}
