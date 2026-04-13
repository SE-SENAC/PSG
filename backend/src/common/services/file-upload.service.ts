import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  constructor() {
    this.ensureDirectoryExists();
  }

  /**
   * Garante que o diretório de uploads existe
   */
  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Gera um nome único para o arquivo
   */
  private generateUniqueFilename(originalname: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalname);
    return `${timestamp}-${random}${ext}`;
  }

  /**
   * Retorna a configuração do Multer para upload de imagens
   */
  getImageUploadConfig() {
    return {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, this.uploadDir);
        },
        filename: (_req, file, cb) => {
          const uniqueName = this.generateUniqueFilename(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: this.imageFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    };
  }

  /**
   * Filtro para validar se o arquivo é uma imagem
   */
  private imageFileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          'Apenas arquivos de imagem são permitidos (JPEG, PNG, GIF, WebP)',
        ),
      );
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(
        new BadRequestException(
          'Extensão de arquivo não permitida. Use: jpg, jpeg, png, gif, webp',
        ),
      );
    }

    cb(null, true);
  };

  /**
   * Processa um arquivo de imagem enviado e retorna a URL
   * @param file Arquivo Multer
   * @returns URL da imagem
   */
  processImageUpload(file: Express.Multer.File): string {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    return `${this.baseUrl}/uploads/${file.filename}`;
  }

  /**
   * Delete uma imagem
   * @param filename Nome do arquivo a ser deletado
   */
  deleteImage(filename: string): void {
    if (!filename) return;

    try {
      const filePath = path.join(this.uploadDir, filename);

      // Segurança: verificar se o arquivo está dentro do diretório de uploads
      if (!filePath.startsWith(this.uploadDir)) {
        throw new BadRequestException('Caminho de arquivo inválido');
      }

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Erro ao deletar arquivo ${filename}:`, error);
    }
  }

  /**
   * Extrai o nome do arquivo da URL
   * @param imageUrl URL da imagem
   * @returns Nome do arquivo
   */
  extractFilenameFromUrl(imageUrl: string): string | null {
    if (!imageUrl) return null;
    const match = imageUrl.match(/uploads\/([^/?]+)/);
    return match ? match[1] : null;
  }
}
