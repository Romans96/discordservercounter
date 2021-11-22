var utils = {
// async/await error catcher
    catchAsync: (fn) => (req, res, next) => {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch((err) => next(err));
        }
    },
    authentication: async () => {

    }
}

module.exports = utils;
