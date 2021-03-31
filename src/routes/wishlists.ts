import express from "express";
import { mandatoryAuth } from "../middlewares/auth";
import prisma from "../utilities/db";

const router = express.Router();

router.get("/all", mandatoryAuth, async (req, res) => {
  try {
    switch (req.auth?.role) {
      case "ADMIN":
      case "SUPER": {
        var result = (await prisma.wishlist.findMany({
          include: {
            product: {
              include: {
                comments: true,
                order: true,
                ratings: true,
                user: true,
                wishlist: true,
                category_group: {
                  include: {
                    category: true,
                  },
                },
              },
            },
            user: true,
          },
          orderBy: {
            user_id: "asc",
          },
          where: {}
        })) as Array<any>;
        break;
      }
      default: {
        var result = (await prisma.wishlist.findMany({
          where: {
            user_id: req.auth?.id,
          },
          include: {
            product: {
              include: {
                comments: true,
                order: true,
                ratings: true,
                user: true,
                wishlist: true,
                category_group: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        })) as Array<any>;
      }
    }

    res.send({
      error: false,
      message: "Successfully retrieved all wishlists",
      data: result,
    });
  } catch (error) {
    res.send({
      error: true,
      message: error.message,
      data: null,
    });
  }
});

router.put("/add", mandatoryAuth, async (req, res) => {
  try {
    const { product_id } = req.body;

    const wishlistItem = await prisma.wishlist.create({
      data: {
        product_id,
        user_id: req.auth?.id as string,
      },
    });

    res.send({
      error: false,
      message: "Successfully created wishlist",
      data: wishlistItem,
    });
  } catch (error) {
    res.send({
      error: true,
      message: error.message,
      data: null,
    });
  }
});

router.delete("/remove/:id", mandatoryAuth, async (req, res) => {
  try {
    await prisma.wishlist.deleteMany({
      where: {
        id: parseInt(req.params.id),
        user_id: req.auth?.id as string,
      },
    });
    res.send({
      message: "Successfully removed product from wishlist.",
      data: null,
      error: false,
    });
  } catch (error) {
    res.send({
      error: true,
      message: error.message,
      data: null,
    });
  }
});

export default router;
