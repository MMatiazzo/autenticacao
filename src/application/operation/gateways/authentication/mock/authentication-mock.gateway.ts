import { env } from "process";
import { IAuthenticationGateway } from '../Iauthentication.gateway';
import { cognitoApi } from "../../../../../shared/axios/api";
import { BadRequestException } from "@nestjs/common";

export class MockAuth implements IAuthenticationGateway {
    async registrar(username: string, email: string, senha: string) {
        return {
            UserConfirmed: true,
            message: 'User confirmed'
        }
    }

    async autenticar(nome: string, senha: string): Promise<any> {
        // tokens.AuthenticationResult.AccessToken
        return {
            token: 'token',
            AuthenticationResult: {
                AccessToken: 'token',
            }
        }
    }

    async decodificarToken(token: string): Promise<any> {
        return {
            nome: 'nome',
            email: 'email',
        }
    }

    async deletar(token: string): Promise<void> {
        return;
    }
}