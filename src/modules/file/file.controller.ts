import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Request,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import {
  AppGet,
  AppPost,
  Claim,
  GuardAccessControl,
} from '@app/decorators/app.decorator';
import { API_CONSUMES } from '@app/constants/app.constant';
import { UploadFileDto } from './common/dtos/create-file.dto';
import { MediaFile as FileEntity } from './models/entities/file.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AppRequest, PaginatedParams } from '@app/interfaces/index.type';
import { Pagination } from '@app/decorators/pagination.decorator';

@ApiTags('Files')
@Controller({
  path: 'file',
  version: '1',
})
@GuardAccessControl()
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @AppPost('uploads', {
    summary: 'Upload multiple files',
    responseType: [FileEntity],
  })
  @ApiConsumes(API_CONSUMES.FORM_DATA)
  @UseInterceptors(FilesInterceptor('files'))
  @Claim('create:file')
  async uploads(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() _: UploadFileDto, // for swagger purposes only
    @Request() req: AppRequest,
  ) {
    if (!files || !files.length) {
      throw new Error(
        'Cannot upload file(s) that are not received from the client.',
      );
    }
    const result = await this.fileService.uploadFiles(files, req);
    return result;
  }

  @AppGet('', {
    paginated: true,
    summary: 'Get all files',
    responseType: [FileEntity],
  })
  @Claim('read:file')
  getFiles(@Pagination() opts: PaginatedParams) {
    return this.fileService.getFiles(opts);
  }

  @AppGet(':id', {
    paginated: false,
    summary: 'Get a file by id',
    responseType: FileEntity,
  })
  @Claim('read:file')
  getFile(@Param('id') id: string) {
    return this.fileService.getFile(id);
  }

  @AppGet('download/:id', {
    summary: 'Download a file',
  })
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  @Claim('read:file')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileService.getFile(id);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    const response = await fetch(encodeURI(file.path));
    const blob = await response.blob();

    const downloadedFile = new File([blob], file.name, {
      type: file.mimeType,
    });
    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename=${file.name}`,
    });
    res.contentType(file.mimeType);
    res.send(downloadedFile);
    return true;
  }
}
