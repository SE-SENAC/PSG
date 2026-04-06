export class CPFApiValidation {
  async validateCPF(cpf: string) {
    let isValid = false;

    cpf = cpf.replace(/[^\d]/g, '');

    if (/^(\d)\1{10}$/.test(cpf)) {
      return false;
    }

    const DigitoVerificador = cpf.slice(9, 11);
    let primeiroDigitoVerificador = 0;
    let segundoDigitoVerificador = 0;

    const primNoveNumeros = cpf.slice(0, 9);

    // Calcular o primeiro dígito verificador
    const numerosMultPeso = primNoveNumeros
      .split('')
      .map((numero, index) => Number(numero) * (10 - index)); // Peso de 10 a 2
    const soma = numerosMultPeso.reduce((prev, curr) => prev + curr, 0);
    const somaDiv = soma % 11;
    primeiroDigitoVerificador = somaDiv < 2 ? 0 : 11 - somaDiv;

    // Calcular o segundo dígito verificador
    const DezNumeros = primNoveNumeros.concat(
      String(primeiroDigitoVerificador),
    );
    const DezNumerosMultPeso = DezNumeros.split('').map(
      (numero, index) => Number(numero) * (11 - index), // Peso de 11 a 2
    );
    const somaDezNumeros = DezNumerosMultPeso.reduce(
      (prev, curr) => prev + curr,
      0,
    );
    const somaDezDiv = somaDezNumeros % 11;
    segundoDigitoVerificador = somaDezDiv < 2 ? 0 : 11 - somaDezDiv;

    // Verificar se os dígitos calculados são iguais aos do CPF
    if (
      DigitoVerificador ===
      String(primeiroDigitoVerificador).concat(String(segundoDigitoVerificador))
    ) {
      isValid = true;
    }

    return isValid;
  }
}
