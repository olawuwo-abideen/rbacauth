import {
Body,
Controller,
Delete,
Get,
HttpStatus,
Param,
Post,
Put,
UseGuards,
} from '@nestjs/common';
import { Logistic } from '../schemas/logistic.schema';
import { CreateLogisticDto, UpdateLogisticDto } from '../dto/logistic.dto';
import { LogisticService } from '../services/logistic.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Logistic')
@Controller('logistic')
export class LogisticController {
constructor(private logisticService: LogisticService) {}


@Get()
@ApiOperation({ summary: 'User retrieved logistics' })
@ApiResponse({
status: HttpStatus.OK,
description:
'User successfully signed up.',
})
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: You do not have permission to access this resource.' })
@UseGuards(AuthGuard(), RolesGuard)
async getAllLogistics(): Promise<{ message: string; logistics: Logistic[] }> {
return this.logisticService.findAll();
}


@Post()
@ApiOperation({ summary: 'User create logistic' })
@ApiBody({ type: CreateLogisticDto, description: 'Logistic data' })
@ApiResponse({
status: HttpStatus.CREATED,
description:
'Logistic create sucessfully',
})
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: You do not have permission to access this resource.' })
@UseGuards(AuthGuard(), RolesGuard)
async createLogistic(
@Body() logistic: CreateLogisticDto,
): Promise<{ message: string; logistic: Logistic }> {
return this.logisticService.create(logistic);
}


@Get(':id')
@ApiOperation({ summary: 'User retrieved logistic' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Logistic retrieved successfully',
})
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: You do not have permission to access this resource.' })
@Roles(Role.Admin)
@UseGuards(AuthGuard(), RolesGuard)
async getLogistic(@Param('id') id: string): Promise<{ message: string; logistic: Logistic }> {
return this.logisticService.findById(id);
}

@Put(':id')
@ApiOperation({ summary: 'User update logistic' })
@ApiResponse({ 
status: HttpStatus.OK,
description:
'Logistic updated successfully.',
})
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: You do not have permission to access this resource.' })
@Roles(Role.Shipper)
@UseGuards(AuthGuard(), RolesGuard)
async updateLogistic(
@Param('id') id: string,
@Body() logistic: UpdateLogisticDto,
): Promise<{ message: string; logistic: Logistic }> {
return this.logisticService.updateById(id, logistic);
}

@Delete(':id')
@ApiOperation({ summary: 'User delete logistic' })
@ApiResponse({
status: HttpStatus.OK,
description:
'Logistic deleted successfully',
})
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: You do not have permission to access this resource.' })
@Roles(Role.Carrier)
@UseGuards(AuthGuard(), RolesGuard)
async deleteLogistic(@Param('id') id: string): Promise<{ message: string; deleted: boolean }> {
return this.logisticService.deleteById(id);
}



}
