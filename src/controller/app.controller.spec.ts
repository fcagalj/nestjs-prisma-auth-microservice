import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import * as employeesJson from './employees.data.json';
import { AppController } from './app.controller';
import { PrismaService } from '../services/prisma.service';
import { EmployeeService } from '../services/employee.service';
import { StatisticsService } from '../services/statistics.service';
import { UserService } from '../services/user.service';

let app: INestApplication;
let controller: AppController;
let prisma: PrismaService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [PrismaService, UserService, EmployeeService, StatisticsService],
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

const dropDatabase = () => {
  return Promise.all([prisma.employee.deleteMany(), prisma.user.deleteMany()]);
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
});
