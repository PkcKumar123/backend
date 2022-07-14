import User from "../models/User";
import CustomErrorHandler from "../services/CustomErrorHandler";

export const me = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select(
      "-password -updatedAt -__v"
    );
    if (!user) {
      return next(CustomErrorHandler.notFound());
    }
    res.json(user);
  } catch (err) {
    return next(err);
  }
};