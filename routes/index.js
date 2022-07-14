import express from "express";
import { loginController } from "../controllers/loginController";
import { logout } from "../controllers/logout";
import {
  distroy,
  getProducts,
  index,
  productController,
  show,
  update,
} from "../controllers/product/productController";
import { refreshController } from "../controllers/refreshController";
import { register } from "../controllers/registerController";
import { me } from "../controllers/whoisme";
import admin from "../middlewares/admin";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/register", register);

router.post("/login", loginController);

router.get("/me", auth, me);

router.post("/refresh", refreshController);

router.post("/logout", auth, logout);

//products
router.post("/products/cart-items", getProducts);

router.post("/products", [auth, admin], productController);

router.put("/products/:id", [auth, admin], update);

router.delete("/products/:id", [auth, admin], distroy);

router.get("/products", index);

router.get("/products/:id", show);

export default router;
