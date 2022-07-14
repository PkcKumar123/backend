import Joi from "joi";
import refreshToken from "../models/refreshToken";

export const logout = async (req, res, next) => {
  // validate
  const refreshSchema = Joi.object({
    refresh_token: Joi.string().required(),
  });

  const { error } = refreshSchema.validate(req.body);

  if (error) {
    return next(error);
  }
  try {
    await refreshToken.deleteOne({ token: req.body.refresh_token });
  } catch (err) {
    return next(new Error("Something went wrong in database"));
  }
  res.json({ status: 1 });
};
