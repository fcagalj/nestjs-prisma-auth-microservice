import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { PrismaService } from './services/prisma.service';
import { EmployeeService } from './services/employee.service';
import { StatisticsService } from './services/statistics.service';
import { UserService } from './services/user.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [PrismaService, EmployeeService, StatisticsService, UserService],
})
export class AppModule {}
