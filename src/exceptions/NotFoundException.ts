import HttpException from './HttpException';

class NotFoundException extends HttpException {
    public error?: any;
    constructor(error?: any) {
        super(404, error);
        this.error = error
    }
}

export default NotFoundException;
