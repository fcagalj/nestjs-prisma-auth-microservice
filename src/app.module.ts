import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { PrismaService } from './services/prisma.service';
import { EmployeeService } from './services/employee.service';
import { StatisticsService } from './services/statistics.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController],
  providers: [PrismaService, EmployeeService, StatisticsService],
})
export class AppModule {}
