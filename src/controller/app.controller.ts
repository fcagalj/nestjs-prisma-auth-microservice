import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from '../services/employee.service';
import { Employee as EmployeeModel } from '@prisma/client';
import {
  StatisticsSummary,
  StatisticsService,
  DepartmentSSResponse,
  SubDepartmentSSResponse,
} from '../services/statistics.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
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
  @UseGuards(JwtAuthGuard)
  async createEmployee(
    @Body()
    employeeData: CreateEmployeeDto,
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
  async getSSForAll(): Promise<StatisticsSummary> {
    return this.statisticsService.getSSForAll();
  }

  @Get('statistic-contractors')
  async getSSForContractors(): Promise<StatisticsSummary> {
    return this.statisticsService.getSSForContractors();
  }

  @Get('statistic-departments')
  async getSSForDepartments(): Promise<DepartmentSSResponse[]> {
    return this.statisticsService.getSSForDepartments();
  }

  @Get('statistic-subdepartments')
  async getSSForSubDepartments(): Promise<SubDepartmentSSResponse[]> {
    return this.statisticsService.getSSForSubDepartments();
  }
}
