class ExpressError {
    constructor(status=500, message='Internal Server Error!!!') {
        this.status = status;
        this.message = message;
    };
};

module.exports = ExpressError;