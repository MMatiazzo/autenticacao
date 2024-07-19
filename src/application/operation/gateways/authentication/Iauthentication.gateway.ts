export interface IAuthenticationGateway {
  registrar(username: string, email: string, senha: string): Promise<any>;
  autenticar(nome: string, senha: string): Promise<any>;
  decodificarToken(token: string): Promise<any>;
  deletar(token: string): Promise<void>;
}

export const IAuthenticationGateway = Symbol('IAuthenticationGateway');
