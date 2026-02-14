import {
  Body,
  Controller,
  Param,
  UploadedFiles,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import {
  AppDel,
  AppPost,
  GuardAccessControl,
} from '@app/decorators/app.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductMediaService } from '../services/product-media.service';
import { AppRequest } from '@app/interfaces/index.type';
import { UploadFileDto } from '@app/modules/employee/common/dtos/upload-file.dto';
import { API_CONSUMES } from '@app/constants/app.constant';

@ApiTags()
@Controller({
  path: 'product',
  version: '1',
})
@GuardAccessControl()
export class ProductMediaController {
  constructor(private readonly productMediaService: ProductMediaService) {}

  @AppPost(':id/media', {
    summary: 'upload product media',
  })
  @ApiConsumes(API_CONSUMES.FORM_DATA)
  @UseInterceptors(FilesInterceptor('files'))
  async uploads(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id') productId: string,
    @Body() _: UploadFileDto, // for swagger purposes only
    @Request() req: AppRequest,
  ) {
    if (!files || !files.length) {
      throw new Error(
        'Cannot upload file(s) that are not received from the client.',
      );
    }
    const result = await this.productMediaService.upload(productId, files, req);
    return result;
  }

  @AppDel(':id/media/:productMediaId', {
    summary: 'Delete product media by id',
  })
  removeOne(
    @Param('id') productId: string,
    @Param('productMediaId') productMediaId: string,
  ) {
    return this.productMediaService.remove(productId, productMediaId);
  }
}
