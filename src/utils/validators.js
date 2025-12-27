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

// --- NOVA VALIDAÇÃO DE DATA ---
export const getBirthDateError = (dateString) => {
  if (!dateString) return null; // Se estiver vazio, deixa o 'required' do HTML tratar ou retorna erro se preferir

  // Converte a string "YYYY-MM-DD" para números para evitar problemas de fuso horário
  const [year, month, day] = dateString.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  // 1. Validação de Ano Absurdo (Sanidade)
  // Ninguém nasceu antes de 1900 e ninguém nasceu no futuro
  if (year < 1900 || year > today.getFullYear()) {
    return "Ano de nascimento inválido. Insira um ano realista.";
  }

  // 2. Validação de Maioridade (18 anos)
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);

  // Se ainda não chegou o mês do aniversário, ou é o mês mas não chegou o dia
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }

  if (age < 18) {
    return "É necessário ter pelo menos 18 anos para se cadastrar.";
  }

  return null;
};