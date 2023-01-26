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

export type SubDepartmentSSResponse = {
  name: string;
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
    // TODO: this query can be optimized, out of the current scope
    const departments = await this.prisma.employee.groupBy({
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

    // more elegant would be to use lodash groupBy here
    const groupedDepartments = {};
    departments.forEach((department) => {
      if (!groupedDepartments[department.department]) {
        groupedDepartments[department.department] = [];
      }
      groupedDepartments[department.department].push(department);
    });

    return Object.values(groupedDepartments).map((departmentsGroup) => {
      return {
        name: departmentsGroup[0].department,
        // TODO: fix typings
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        subDepartments: departmentsGroup.map((subDepartment) => {
          return {
            name: subDepartment.sub_department,
            statisticSummary: {
              min: subDepartment._min.salary || 0,
              max: subDepartment._max.salary || 0,
              mean: subDepartment._avg.salary || 0,
            },
          };
        }),
      };
    });
  }
}
