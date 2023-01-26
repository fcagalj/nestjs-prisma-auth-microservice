import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { EmployeeService } from './employee.service';

export type StatisticsSummary = {
  min: number;
  max: number;
  mean: number;
};

export type DepartmentSSResponse = {
  name: string;
  statisticSummary: StatisticsSummary;
};

export type SubDepartmentSSResponse = DepartmentSSResponse & {
  subDepartments: DepartmentSSResponse[];
};

@Injectable()
export class StatisticsService {
  constructor(
    private prisma: PrismaService,
    private employeeService: EmployeeService,
  ) {}

  async getSSForAll(): Promise<StatisticsSummary> {
    const {
      _avg: { salary: mean },
      _min: { salary: min },
      _max: { salary: max },
    } = await this.prisma.employee.aggregate({
      _avg: {
        salary: true,
      },
      _min: {
        salary: true,
      },
      _max: {
        salary: true,
      },
    });
    return { min: min || 0, max: max || 0, mean: mean || 0 };
  }

  async getSSForContractors(): Promise<StatisticsSummary> {
    const {
      _avg: { salary: mean },
      _min: { salary: min },
      _max: { salary: max },
    } = await this.prisma.employee.aggregate({
      _avg: {
        salary: true,
      },
      _min: {
        salary: true,
      },
      _max: {
        salary: true,
      },
      where: {
        on_contract: true,
      },
    });
    return { min: min || 0, max: max || 0, mean: mean || 0 };
  }

  async getSSForDepartments(): Promise<DepartmentSSResponse[]> {
    const departments = await this.prisma.employee.groupBy({
      by: ['department'],
      _avg: {
        salary: true,
      },
      _min: {
        salary: true,
      },
      _max: {
        salary: true,
      },
    });

    return departments.map(
      ({
        department,
        _avg: { salary: mean },
        _min: { salary: min },
        _max: { salary: max },
      }) => {
        return {
          name: department,
          statisticSummary: { min: min || 0, max: max || 0, mean: mean || 0 },
        };
      },
    );
  }

  async getSSForSubDepartments(): Promise<SubDepartmentSSResponse[]> {
    const aggregations = await this.prisma.employee.groupBy({
      by: ['department', 'sub_department'],
      _avg: {
        salary: true,
      },
      _min: {
        salary: true,
      },
      _max: {
        salary: true,
      },
    });

    console.log(
      `--> 
    aggregations:: `,
      aggregations,
    );

    return [
      {
        name: 'test',
        statisticSummary: { min: 1, max: 2, mean: 3 },
        subDepartments: [
          { name: 'test', statisticSummary: { min: 1, max: 2, mean: 3 } },
        ],
      },
    ];
  }
}
