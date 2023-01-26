import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as employeesJson from './employees.data.json';
import { AppController } from './app.controller';
import { PrismaService } from '../services/prisma.service';
import { EmployeeService } from '../services/employee.service';
import { StatisticsService } from '../services/statistics.service';

let app: INestApplication;
let controller: AppController;
let prisma: PrismaService;

const dropDatabase = () => {
  return Promise.all([prisma.employee.deleteMany(), prisma.user.deleteMany()]);
};

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, EmployeeService, StatisticsService],
    controllers: [AppController],
  }).compile();
  app = module.createNestApplication();
  controller = module.get<AppController>(AppController);
  prisma = app.get<PrismaService>(PrismaService);
});

const createEmployee = async (createEmployeeInput) => {
  const employeeRes = await controller.createEmployee({
    ...createEmployeeInput,
    onContract: !!createEmployeeInput.on_contract,
    subDepartment: createEmployeeInput.sub_department,
  });

  expect(employeeRes).toMatchObject({
    ...createEmployeeInput,
    on_contract: !!createEmployeeInput.on_contract,
  });
  expect(employeeRes?.id).toBeDefined();
  return employeeRes;
};
const createEmployees = async (employees) => {
  return Promise.all(
    employees.map(async (createEmployeeInput) =>
      createEmployee(createEmployeeInput),
    ),
  );
};

describe('AppController', () => {
  beforeEach(async () => await dropDatabase());
  it('can create employee', async () => {
    const createdEmployee = await createEmployee(employeesJson[0]);
    const savedEmployee = await controller.getEmployeeId(
      createdEmployee.id.toString(),
    );

    expect(savedEmployee.name).toEqual(employeesJson[0].name);
  });

  it('can delete employee', async () => {
    const createdEmployee = await createEmployee(employeesJson[0]);
    await controller.deleteEmployee(createdEmployee.id.toString());

    const savedEmployee = await controller.getEmployeeId(
      createdEmployee.id.toString(),
    );

    expect(savedEmployee).toEqual(null);
  });

  it('can calculate summary statistics (mean, min, max)', async () => {
    await createEmployees(employeesJson);

    const res = await controller.getSSForAll();

    const min = employeesJson.reduce(
      (min, employee) => Math.min(min, Number(employee.salary)),
      Number(employeesJson[0].salary),
    );
    const max = employeesJson.reduce(
      (max, employee) => Math.max(max, Number(employee.salary)),
      Number(employeesJson[0].salary),
    );
    const sum = employeesJson.reduce(
      (sum, employee) => sum + Number(employee.salary),
      0,
    );
    const mean = sum / employeesJson.length;
    expect(res.max).toEqual(max);
    expect(res.min).toEqual(min);
    expect(res.mean).toEqual(mean);
  });

  it('can calculate summary statistics for contractors (mean, min, max)', async () => {
    await createEmployees(employeesJson);

    const res = await controller.getSSForContractors();

    const contractors = employeesJson.filter((e) => e.on_contract);

    const min = contractors.reduce(
      (min, employee) => Math.min(min, Number(employee.salary)),
      Number(contractors[0].salary),
    );
    const max = contractors.reduce(
      (max, employee) => Math.max(max, Number(employee.salary)),
      Number(contractors[0].salary),
    );
    const sum = contractors.reduce(
      (sum, employee) => sum + Number(employee.salary),
      0,
    );
    const mean = sum / contractors.length;
    expect(res.max).toEqual(max);
    expect(res.min).toEqual(min);
    expect(res.mean).toEqual(mean);
  });

  it('can calculate summary statistics for departments (mean, min, max)', async () => {
    await createEmployees(employeesJson);

    const res = await controller.getSSForDepartments();

    const engineeringDepartmentInput = employeesJson.filter(
      (e) => e.department === 'Engineering',
    );

    const engineeringDepartmentRes = res.find((e) => e.name === 'Engineering');
    const min = engineeringDepartmentInput.reduce(
      (min, employee) => Math.min(min, Number(employee.salary)),
      Number(engineeringDepartmentInput[0].salary),
    );
    const max = engineeringDepartmentInput.reduce(
      (max, employee) => Math.max(max, Number(employee.salary)),
      Number(engineeringDepartmentInput[0].salary),
    );
    const sum = engineeringDepartmentInput.reduce(
      (sum, employee) => sum + Number(employee.salary),
      0,
    );
    const mean = sum / engineeringDepartmentInput.length;
    expect(engineeringDepartmentRes.statisticSummary.max).toEqual(max);
    expect(engineeringDepartmentRes.statisticSummary.min).toEqual(min);
    expect(engineeringDepartmentRes.statisticSummary.mean).toEqual(mean);
  });

  it('can calculate summary statistics for departments (mean, min, max)', async () => {
    await createEmployees(employeesJson);

    const res = await controller.getSSForSubDepartments();

    const engineeringPlatformSubDepartmentInput = employeesJson.filter(
      (e) => e.department === 'Engineering' && e.sub_department === 'Platform',
    );

    const engineeringPlatformDepartmentRes = res.find(
      (e) => e.name === 'Engineering',
    );
    const engineeringPlatformDepartmentResSubDepartment =
      engineeringPlatformDepartmentRes.subDepartments.find(
        (e) => e.name === 'Platform',
      );
    const min = engineeringPlatformSubDepartmentInput.reduce(
      (min, employee) => Math.min(min, Number(employee.salary)),
      Number(engineeringPlatformSubDepartmentInput[0].salary),
    );
    const max = engineeringPlatformSubDepartmentInput.reduce(
      (max, employee) => Math.max(max, Number(employee.salary)),
      Number(engineeringPlatformSubDepartmentInput[0].salary),
    );
    const sum = engineeringPlatformSubDepartmentInput.reduce(
      (sum, employee) => sum + Number(employee.salary),
      0,
    );
    const mean = sum / engineeringPlatformSubDepartmentInput.length;
    expect(
      engineeringPlatformDepartmentResSubDepartment.statisticSummary.max,
    ).toEqual(max);
    expect(
      engineeringPlatformDepartmentResSubDepartment.statisticSummary.min,
    ).toEqual(min);
    expect(
      engineeringPlatformDepartmentResSubDepartment.statisticSummary.mean,
    ).toEqual(mean);
  });
});
