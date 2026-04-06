import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Heading,
  Section,
  Img,
  Preview,
} from '@react-email/components';

interface ResetPasswordTemplateProps {
  name: string;
  resetLink: string;
}

export const ResetPasswordTemplate = ({
  name,
  resetLink,
}: ResetPasswordTemplateProps) => (
  <Html>
    <Head />
    <Preview>PSG - Recuperação de Senha</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          {/* Você pode trocar por uma URL de imagem real posteriormente */}
          <Heading style={h1}>PSG - SENAC</Heading>
        </Section>
        <Section style={contentSection}>
          <Text style={text}>Olá, {name},</Text>
          <Text style={text}>
            Você solicitou a recuperação de senha para sua conta no PSG.
            Não se preocupe, isso acontece com os melhores!
          </Text>
          <Text style={text}>
            Clique no botão abaixo para definir sua nova senha. Este link é válido por 1 hora.
          </Text>
          <Section style={buttonContainer}>
            <Link href={resetLink} style={button}>
              Resetar minha senha
            </Link>
          </Section>
          <Text style={footerText}>
            Se você não solicitou esta alteração, por favor ignore este e-mail.
          </Text>
        </Section>
        <Section style={footer}>
          <Text style={footerLegalTrademarks}>
            © 2026 PSG - SENAC. Todos os direitos reservados.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoSection = {
  textAlign: 'center' as const,
  padding: '10px 0',
  backgroundColor: '#004587',
  color: '#ffffff',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '20px 0',
};

const contentSection = {
  padding: '0 48px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'left' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#004587',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 24px',
  margin: '0 auto',
};

const footerText = {
  ...text,
  fontSize: '14px',
  color: '#8898aa',
  marginTop: '32px',
};

const footer = {
  textAlign: 'center' as const,
  marginTop: '10px',
  padding: '0 48px',
};

const footerLegalTrademarks = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};
