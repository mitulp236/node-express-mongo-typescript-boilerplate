import HttpException from './HttpException';

class ForbiddenException extends HttpException {
    public error?: any;
    constructor(error?: any) {
        super(403, error);
        this.error = error
    }
}

export default ForbiddenException;
