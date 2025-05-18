import { users, type User, type InsertUser, products, type Product, type InsertProduct, favorites, type Favorite, type SearchProductsInput } from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, between, inArray, desc, or, sql, gte, lte } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(params: SearchProductsInput): Promise<Product[]>;
  createProduct(product: InsertProduct & { sellerId: number }): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  getCategories(): Promise<string[]>;
  
  // Favorite methods
  addFavorite(userId: number, productId: number): Promise<Favorite>;
  removeFavorite(userId: number, productId: number): Promise<void>;
  getUserFavorites(userId: number): Promise<Product[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async searchProducts(params: SearchProductsInput): Promise<Product[]> {
    console.log("Searching with params:", params);
    
    // Start with basic query
    let query = db.select().from(products).where(eq(products.active, true));
    
    // Apply text search if query is provided
    if (params.query && params.query.trim() !== '') {
      query = db.select().from(products).where(
        and(
          eq(products.active, true),
          ilike(products.title, `%${params.query}%`)
        )
      );
    }
    
    // Apply category filter
    if (params.category && params.category.trim() !== '') {
      query = db.select().from(products).where(
        and(
          eq(products.active, true),
          eq(products.category, params.category)
        )
      );
    }
    
    // Apply price range filter
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      let priceFilter;
      
      if (params.minPrice !== undefined && params.maxPrice !== undefined) {
        priceFilter = between(products.price, params.minPrice * 100, params.maxPrice * 100);
      } else if (params.minPrice !== undefined) {
        // Use greater than or equal
        const minPriceInCents = params.minPrice * 100;
        priceFilter = sql`${products.price} >= ${minPriceInCents}`;
      } else if (params.maxPrice !== undefined) {
        // Use less than or equal
        const maxPriceInCents = params.maxPrice * 100;
        priceFilter = sql`${products.price} <= ${maxPriceInCents}`;
      }
      
      if (priceFilter) {
        query = db.select().from(products).where(
          and(
            eq(products.active, true),
            priceFilter
          )
        );
      }
    }
    
    // Apply condition filter
    if (params.condition && params.condition.length > 0) {
      query = db.select().from(products).where(
        and(
          eq(products.active, true),
          inArray(products.condition, params.condition)
        )
      );
    }
    
    // Apply seller filter
    if (params.sellerId !== undefined) {
      query = db.select().from(products).where(
        and(
          eq(products.active, true),
          eq(products.sellerId, params.sellerId)
        )
      );
    }
    
    // Order by newest first
    const result = await db.select()
      .from(products)
      .where(eq(products.active, true))
      .orderBy(desc(products.createdAt));
    
    // Client-side filtering if needed
    let filteredResults = result;
    
    // Apply text search
    if (params.query && params.query.trim() !== '') {
      const searchQuery = params.query.toLowerCase();
      filteredResults = filteredResults.filter(product => 
        product.title.toLowerCase().includes(searchQuery) || 
        product.description.toLowerCase().includes(searchQuery)
      );
    }
    
    // Apply category filter
    if (params.category && params.category.trim() !== '') {
      filteredResults = filteredResults.filter(product => 
        product.category === params.category
      );
    }
    
    // Apply price filters
    if (params.minPrice !== undefined) {
      const minPriceInCents = params.minPrice * 100;
      filteredResults = filteredResults.filter(product => 
        product.price >= minPriceInCents
      );
    }
    
    if (params.maxPrice !== undefined) {
      const maxPriceInCents = params.maxPrice * 100;
      filteredResults = filteredResults.filter(product => 
        product.price <= maxPriceInCents
      );
    }
    
    // Apply condition filter
    if (params.condition && params.condition.length > 0) {
      filteredResults = filteredResults.filter(product => 
        params.condition!.includes(product.condition)
      );
    }
    
    // Apply seller filter
    if (params.sellerId !== undefined) {
      filteredResults = filteredResults.filter(product => 
        product.sellerId === params.sellerId
      );
    }
    
    return filteredResults;
  }

  async createProduct(product: InsertProduct & { sellerId: number }): Promise<Product> {
    // Convert price from dollars to cents for storage
    const productWithCents = {
      ...product,
      price: product.price * 100
    };
    
    const [newProduct] = await db
      .insert(products)
      .values(productWithCents)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: InsertProduct): Promise<Product> {
    // Convert price from dollars to cents for storage
    const productWithCents = {
      ...product,
      price: product.price * 100
    };
    
    const [updatedProduct] = await db
      .update(products)
      .set(productWithCents)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    // Soft delete by setting active to false
    await db
      .update(products)
      .set({ active: false })
      .where(eq(products.id, id));
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(and(
        eq(products.sellerId, sellerId),
        eq(products.active, true)
      ))
      .orderBy(desc(products.createdAt));
  }

  async getCategories(): Promise<string[]> {
    const result = await db
      .select({ category: products.category })
      .from(products)
      .where(eq(products.active, true))
      .groupBy(products.category);
    
    return result.map(row => row.category);
  }

  // Favorite methods
  async addFavorite(userId: number, productId: number): Promise<Favorite> {
    // Check if favorite already exists
    const existingFavorite = await db
      .select()
      .from(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.productId, productId)
      ));
    
    if (existingFavorite.length > 0) {
      return existingFavorite[0];
    }
    
    const [favorite] = await db
      .insert(favorites)
      .values({
        userId,
        productId
      })
      .returning();
    
    return favorite;
  }

  async removeFavorite(userId: number, productId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(and(
        eq(favorites.userId, userId),
        eq(favorites.productId, productId)
      ));
  }

  async getUserFavorites(userId: number): Promise<Product[]> {
    const userFavorites = await db
      .select({
        product: products
      })
      .from(favorites)
      .innerJoin(products, eq(favorites.productId, products.id))
      .where(and(
        eq(favorites.userId, userId),
        eq(products.active, true)
      ));
    
    return userFavorites.map(row => row.product);
  }
}

export const storage = new DatabaseStorage();
