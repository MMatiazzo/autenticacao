import axios from 'axios';
import { env } from 'process';

const cognitoApi = axios.create({
  baseURL: env.COGNITO_URL,
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/x-amz-json-1.1',
    'Connection': 'keep-alive',
  }
});

export {
  cognitoApi
}


