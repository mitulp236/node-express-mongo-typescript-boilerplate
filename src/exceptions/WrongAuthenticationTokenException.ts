import HttpException from './HttpException';
import {app} from '..';

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong or expired authentication token');
  }
}

export default WrongAuthenticationTokenException;
