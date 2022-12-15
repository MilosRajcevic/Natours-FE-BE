const catchAsyncError = (fn) => {
  // Fn je zaparavo async function i onda vraca prommis
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

module.exports = catchAsyncError;
