
export type AutenticaClienteDto = {
  crm?: string;
  cpf?: string;
  nome?: string;
  email?: string;
  senha?: string;
  autenticar: boolean;
  type: 'medico' | 'paciente';
  especialidade: string;
};
