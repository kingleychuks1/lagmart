import cookieParser from "cookie-parser";
import logger from "morgan";
import express from "express";
import helmet from "helmet";
import { PORT, STATIC } from "./utilities/config";

import usersRouter from "./routes/users";
import itemsRouter from "./routes/items";
import productsRouter from "./routes/products";
import cartsRouter from "./routes/carts";
import wishlistsRouter from "./routes/wishlists";
import paymentRouter from "./routes/payments";

const app = express();

if (module.parent) {
  app.use(logger("dev"));
} else {
  app.use(helmet());
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(STATIC));

app.use("/users", usersRouter);
app.use("/items", itemsRouter);
app.use("/products", productsRouter);
app.use("/cart", cartsRouter);
app.use("/wishlists", wishlistsRouter);
app.use("/payments", paymentRouter);

if (module.parent) {
  module.exports = app;
} else {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
