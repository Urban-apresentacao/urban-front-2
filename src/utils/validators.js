export const validateCPF = (cpf) => {
  if (!cpf) return false;
  const cleanCPF = cpf.replace(/\D/g, '');

  if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;

  let sum = 0, remainder;
  
  for (let i = 1; i <= 9; i++) 
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) 
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  remainder = (sum * 10) % 11;
  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
};

export const validateEmail = (email) => {
  if (!email) return false;
  // Regex padrão: verifica caracteres antes do @, o @, domínio, ponto e extensão
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  if (!password) return false;

  // Regex explicada:
  // (?=.*[a-z]) -> Pelo menos uma minúscula
  // (?=.*[A-Z]) -> Pelo menos uma maiúscula
  // (?=.*\d)    -> Pelo menos um número
  // (?=.*[\W_]) -> Pelo menos um caractere especial (!@#$...)
  // .{8,}       -> No mínimo 8 caracteres
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  
  return regex.test(password);
};

export const getPasswordIssues = (password) => {
  const issues = [];
  
  if (!password) {
    return ["A senha é obrigatória."];
  }

  // 1. Tamanho
  if (password.length < 8) {
    issues.push("Mínimo de 8 caracteres");
  }

  // 2. Maiúscula
  if (!/[A-Z]/.test(password)) {
    issues.push("Pelo menos uma letra maiúscula");
  }

  // 3. Minúscula
  if (!/[a-z]/.test(password)) {
    issues.push("Pelo menos uma letra minúscula");
  }

  // 4. Número
  if (!/\d/.test(password)) {
    issues.push("Pelo menos um número");
  }

  // 5. Especial
  if (!/[\W_]/.test(password)) {
    issues.push("Pelo menos um caractere especial (!@#$...)");
  }

  return issues;
};