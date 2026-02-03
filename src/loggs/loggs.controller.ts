import { BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { LoggsService } from "./loggs.service";
import { BearerTokenGuard } from "../auth/bearer-token.guard";
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Logs')
@ApiBearerAuth('bearer')
@UseGuards(BearerTokenGuard)
@Controller('api/v1/logs')
export class LogsController {
  constructor(private readonly service: LoggsService) {}
  
  @ApiOperation({ summary: 'Upload de arquivo de log' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Log file is required');
    }

    if (
      file.mimetype !== 'text/plain' &&
      !file.originalname.endsWith('.log')
    ) {
      throw new BadRequestException(
        'Invalid file format. Expected .log file',
      );
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Empty log file');
    }

    const content = file.buffer.toString();

    if (
      !content.includes('has started') ||
      !content.includes('has ended')
    ) {
      throw new BadRequestException(
        'Invalid log format. No match start/end events found',
      );
    }

    return this.service.processLogFile(file);
  }
}
