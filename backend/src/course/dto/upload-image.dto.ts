import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo de imagem (JPEG, PNG, GIF, WebP)',
  })
  file: Express.Multer.File;
}

export class ImageUrlResponseDto {
  @ApiProperty({ description: 'URL da imagem enviada' })
  @IsString()
  img_url: string;
}
