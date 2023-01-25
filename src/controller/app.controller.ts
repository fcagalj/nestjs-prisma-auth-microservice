import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { EmployeeService } from '../services/employee.service';
import { Employee as EmployeeModel } from '@prisma/client';
import {
  StatisticsRes,
  StatisticsService,
} from '../services/statistics.service';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly employeeService: EmployeeService,
    private readonly statisticsService: StatisticsService,
  ) {}

  @Get('employee/:id')
  async getEmployeeId(@Param('id') id: string): Promise<EmployeeModel> {
    return this.employeeService.employee({ id: Number(id) });
  }

  @Get('employees/:searchString')
  async getFilteredEmployees(
    @Param('searchString') searchString: string,
  ): Promise<EmployeeModel[]> {
    return this.employeeService.employees({
      where: {
        OR: [
          {
            name: { contains: searchString },
          },
          {
            department: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('employee')
  async createEmployee(
    @Body()
    employeeData: {
      name: string;
      salary: string;
      currency: string;
      department: string;
      subDepartment: string;
      onContract?: boolean;
    },
  ): Promise<EmployeeModel> {
    const { name, salary, currency, department, subDepartment, onContract } =
      employeeData;

    return this.employeeService.createEmployee({
      name,
      salary,
      currency,
      department,
      sub_department: subDepartment,
      on_contract: onContract,
    });
  }

  @Delete('employee/:id')
  async deleteEmployee(@Param('id') id: string): Promise<EmployeeModel> {
    return this.employeeService.deleteEmployee({ id: Number(id) });
  }
  @Get('statistic-all')
  async getSSForAll(): Promise<StatisticsRes> {
    return this.statisticsService.getSSForAll();
  }

  @Get('statistic-departments')
  async getSSForDepartments(): Promise<StatisticsRes[]> {
    return this.statisticsService.getSSForDepartments();
  }

  @Get('statistic-subdepartments')
  async getSSForSubDepartments(): Promise<StatisticsRes[]> {
    return this.statisticsService.getSSForSubDepartments();
  }
}
