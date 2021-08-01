import HttpException from './HttpException';

class NotAuthorizedException extends HttpException {
    public error?: any;
    constructor(error?: any) {
        super(500, "You're not authorized");
        this.error = error
    }
}

export default NotAuthorizedException;
