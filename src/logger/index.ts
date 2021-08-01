import developmentLogger from "./developmentLogger";
import productionLogger from "./productionLogger";

let logger = null;

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    logger = productionLogger();
} else {
    logger = developmentLogger();
}

export default logger;