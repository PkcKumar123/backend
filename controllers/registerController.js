import Joi from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler";
import User from "../models/User";
import bcrypt from "bcrypt";
import JwtService from "../services/JwtService";
import { REFRESH_SECRET } from "../config";
import refreshToken from "../models/refreshToken";

export const register = async (req, res, next) => {
  //validation
  const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    repeat_password: Joi.ref("password"),
  });

  const { error } = registerSchema.validate(req.body);

  if (error) {
    return next(error);
  }

  //check if user is in the database
  try {
    const exist = await User.exists({ email: req.body.email });
    if (exist) {
      return next(CustomErrorHandler.alreadyExists("Email already Exists"));
    }
  } catch (err) {
    return next(err);
  }

  const { name, email, password } = req.body;
  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //preaparing the model

  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  let access_token;
  let refresh_token;

  try {
    const result = await user.save();
    // console.log(result);

    //token
    access_token = JwtService.sign({ _id: result._id, role: result.role });
    refresh_token = JwtService.sign(
      { _id: result._id, role: result.role },
      "1y",
      REFRESH_SECRET
    );
    //database white list
    await refreshToken.create({ token: refresh_token });
  } catch (err) {
    return next(err);
  }
  res.json({ access_token, refresh_token });
};

export const update = async (req, res, next) => {
  handleMultipartData(req, res, async (err) => {
    if (err) {
      return next(CustomErrorHandler.serverError(err.message));
    }
    let filePath;
    if (req.file) {
      filePath = req.file.path;
    }

    // validation

    const { error } = productSchema.validate(req.body);
    if (error) {
      // Delete the uploaded file
      if (req.file) {
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          if (err) {
            return next(CustomErrorHandler.serverError(err.message));
          }
        });
      }

      return next(error);
      // rootfolder/uploads/filename.png
    }

    const { name, price, size } = req.body;
    let document;
    try {
      document = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          name,
          price,
          size,
          ...(req.file && { image: filePath }),
        },
        { new: true }
      );
    } catch (err) {
      return next(err);
    }
    res.status(201).json(document);
  });
};
