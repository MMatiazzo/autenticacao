
export type CadastrarMedicoDto = {
  crm: string;
  nome: string;
  email: string;
  senha: string;
  especialidade: string;
};

export type CadastrarPacienteDto = {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
};
