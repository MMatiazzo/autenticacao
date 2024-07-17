
export type ExcluirClienteDto = {
  email: string;
  senha: string;
  type: 'medico' | 'paciente';
};
