import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertProductSchema, searchProductsSchema, insertCartItemSchema, insertPurchaseSchema } from "@shared/schema";
import { Request, Response } from "express";
import { Router } from "express";
import { DatabaseStorage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // API routes
  app.get("/api/products", async (req, res) => {
    try {
      const searchParams = searchProductsSchema.parse({
        query: req.query.query as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        condition: req.query.condition as string,
        certifications: req.query.certifications as string,
        seller_id: req.query.seller_id ? Number(req.query.seller_id) : undefined,
        tags: req.query.tags as string,
        location: req.query.location as string,
        sort_by: req.query.sort_by as any,
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      });
      
      const products = await storage.searchProducts(searchParams);
      res.json(products);
    } catch (error) {
      console.error('Product search error:', error);
      res.status(400).json({ 
        message: "Invalid search parameters",
        details: error instanceof Error ? error.message : undefined
      });
    }
  });

  app.post("/api/products/filter", async (req, res) => {
    try {
      const searchParams = searchProductsSchema.parse(req.body);
      const products = await storage.searchProducts(searchParams);
      res.json(products);
    } catch (error) {
      console.error('Product filter error:', error);
      res.status(400).json({ 
        message: "Invalid filter parameters",
        details: error instanceof Error ? error.message : undefined
      });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Get seller information for the product
      const seller = await storage.getUser(product.seller_id);
      
      // Return product with seller info (excluding password)
      const { password, ...sellerInfo } = seller || { password: '', username: 'Unknown', email: '' };
      res.json({
        ...product,
        seller: sellerInfo
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/products", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validatedData = insertProductSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid product data", errors: validatedData.error.errors });
      }

      const product = await storage.createProduct({
        ...validatedData.data,
        seller_id: req.user!.id
      });

      res.status(201).json(product);
    } catch (error) {
      console.error('Product creation error:', error);
      res.status(500).json({ message: "Failed to create product", details: error instanceof Error ? error.message : undefined });
    }
  });

  app.put("/api/products/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.seller_id !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to update this product" });
      }

      const validatedData = insertProductSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid product data", errors: validatedData.error.errors });
      }

      const updatedProduct = await storage.updateProduct(productId, {
        ...validatedData.data,
        seller_id: product.seller_id
      });
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.seller_id !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to delete this product" });
      }

      await storage.deleteProduct(productId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/user/products", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const products = await storage.getProductsBySeller(req.user!.id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user's products" });
    }
  });

  app.post("/api/favorites/:productId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const favorite = await storage.addFavorite(req.user!.id, productId);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:productId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.productId);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      await storage.removeFavorite(req.user!.id, productId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const favorites = await storage.getUserFavorites(req.user!.id);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Cart routes
  app.get("/api/cart", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const cartItems = await storage.getUserCart(req.user!.id);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const validatedData = insertCartItemSchema.safeParse({
        ...req.body,
        user_id: req.user!.id
      });
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid cart item data", errors: validatedData.error.errors });
      }

      const cartItem = await storage.addToCart(validatedData.data);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const cartItem = await storage.getCartItem(itemId);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      if (cartItem.user_id !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to update this cart item" });
      }

      const validatedData = insertCartItemSchema.partial().safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid cart item data", errors: validatedData.error.errors });
      }

      const updatedItem = await storage.updateCartItem(itemId, validatedData.data);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const cartItem = await storage.getCartItem(itemId);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      if (cartItem.user_id !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to delete this cart item" });
      }

      await storage.removeFromCart(itemId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  // Purchase routes
  app.get("/api/purchases", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const purchases = await storage.getUserPurchases(req.user!.id);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch purchases" });
    }
  });

  app.post("/api/purchases", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const cartItem = await storage.getCartItem(req.body.cart_item_id);
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      if (cartItem.user_id !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to purchase this item" });
      }

      const product = await storage.getProduct(cartItem.product_id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const validatedData = insertPurchaseSchema.safeParse({
        user_id: req.user!.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price: product.price,
      });

      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid purchase data", errors: validatedData.error.errors });
      }

      const purchase = await storage.createPurchase(validatedData.data);
      await storage.removeFromCart(cartItem.id);
      res.status(201).json(purchase);
    } catch (error) {
      res.status(500).json({ message: "Failed to create purchase" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
