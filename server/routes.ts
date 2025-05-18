import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertProductSchema, searchProductsSchema } from "@shared/schema";
import { Request, Response } from "express";

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
        condition: req.query.condition ? (req.query.condition as string).split(',') : undefined,
        certifications: req.query.certifications ? (req.query.certifications as string).split(',') : undefined,
        sellerId: req.query.sellerId ? Number(req.query.sellerId) : undefined,
      });
      
      const products = await storage.searchProducts(searchParams);
      res.json(products);
    } catch (error) {
      res.status(400).json({ message: "Invalid search parameters" });
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
      const seller = await storage.getUser(product.sellerId);
      
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
        sellerId: req.user!.id
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to create product" });
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

      if (product.sellerId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to update this product" });
      }

      const validatedData = insertProductSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid product data", errors: validatedData.error.errors });
      }

      const updatedProduct = await storage.updateProduct(productId, validatedData.data);
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

      if (product.sellerId !== req.user!.id) {
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

  const httpServer = createServer(app);

  return httpServer;
}
