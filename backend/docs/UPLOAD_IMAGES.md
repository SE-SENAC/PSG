# Serviço de Upload de Imagens

Este documento descreve como usar o serviço de upload de imagens para cursos.

## 📋 Visão Geral

O serviço de upload permite que você envie imagens para serem armazenadas no servidor e receba uma URL que pode ser armazenada na coluna `img_url` da tabela de cursos.

## 🚀 Como Usar

### 1. Fazer Upload de Imagem

**Endpoint:** `POST /api/course/upload/image`

**Método:** Multipart Form Data

**Parâmetro:**
- `file` (required): Arquivo de imagem

**Formatos Aceitos:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

**Tamanho Máximo:** 5MB

**Exemplo com cURL:**
```bash
curl -X POST http://localhost:3001/api/course/upload/image \
  -F "file=@/caminho/para/imagem.jpg"
```

**Exemplo com JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3001/api/course/upload/image', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
console.log(data.img_url); // URL da imagem
```

### 2. Resposta de Sucesso

```json
{
  "img_url": "http://localhost:3001/uploads/1234567890-abc123def456.jpg"
}
```

### 3. Criar Curso com Imagem

Após fazer o upload, use a URL retornada para criar o curso:

```bash
curl -X POST http://localhost:3001/api/course \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meu Curso",
    "img_url": "http://localhost:3001/uploads/1234567890-abc123def456.jpg",
    "status_vacancy": 1,
    ...outros campos
  }'
```

## 🔒 Segurança

- ✅ Validação de tipo MIME
- ✅ Validação de extensão de arquivo
- ✅ Limite de tamanho (5MB)
- ✅ Nomes de arquivo únicos e aleatórios
- ✅ Verificação de caminho (previne directory traversal)

## 📁 Estrutura de Armazenamento

As imagens são armazenadas em:
```
/public/uploads/
```

Os nomes de arquivo são gerados automaticamente no formato:
```
[timestamp]-[random-hex].extensão
```

Exemplo: `1681234567890-a1b2c3d4e5f6g7h8.jpg`

## ❌ Tratamento de Erros

### Arquivo não enviado
```json
{
  "statusCode": 400,
  "message": "Nenhum arquivo foi enviado"
}
```

### Tipo de arquivo não permitido
```json
{
  "statusCode": 400,
  "message": "Apenas arquivos de imagem são permitidos (JPEG, PNG, GIF, WebP)"
}
```

### Arquivo muito grande
```json
{
  "statusCode": 413,
  "message": "File too large"
}
```

## 🔧 Configuração

A configuração do serviço está em `src/common/services/file-upload.service.ts`

Para alterar o tamanho máximo de arquivo, edite:
```typescript
limits: {
  fileSize: 5 * 1024 * 1024, // 5MB
}
```

Para alterar os formatos aceitos, edite:
```typescript
const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
```

## 📊 Integração com Frontend

No frontend (Next.js), você pode usar assim:

```typescript
// components/CourseImageUpload.tsx
import { useState } from 'react';

export function CourseImageUpload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/course/upload/image`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      setImageUrl(data.img_url);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        disabled={loading}
      />
      {imageUrl && <img src={imageUrl} alt="Preview" />}
    </div>
  );
}
```

## 🚀 Próximos Passos

Para melhorias futuras, considere:

1. **Storage em Nuvem**: Integrar com AWS S3, Azure Blob, ou similar
2. **Compressão de Imagem**: Reduzir tamanho dos arquivos
3. **Versioning**: Manter histórico de imagens
4. **Cache**: Implementar cache do lado do cliente
5. **CDN**: Usar um CDN para servir imagens mais rapidamente

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação da API em `/docs`
