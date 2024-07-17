export class ClientePresenter {
  static async decodeTokenToUser(token: any) {
    const email = token.UserAttributes.find(useratt => useratt.Name === "email");

    return {
      nome: token.Username,
      email: email?.Value === 'default_user_tech@email.com.br' ? null : email.Value
    }
  }
}