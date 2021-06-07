import HttpException from './HttpException';
import {isString} from 'util';

class InternalServerException extends HttpException {
    public error?: any;
    constructor(error?: any, message?: string) {
        if (message != null) {
            super(500, message);
        }
        else {
            if (isString(error)) {
                super(500, error);
            }
            else {
                super(500, "Internal server error");
            }

        }

        this.error = error;
    }
}

export default InternalServerException;
