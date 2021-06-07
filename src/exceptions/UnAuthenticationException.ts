import HttpException from './HttpException';

class UnAuthenticationException extends HttpException {
  constructor() {
    super(403, 'You dont have access');
  }
}

export default UnAuthenticationException;
