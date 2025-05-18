import { users, type User, type InsertUser, products, type Product, type InsertProduct, favorites, type Favorite, type SearchProductsInput, cart_items, type CartItem, type InsertCartItem, purchases, type Purchase, type InsertPurchase } from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, between, inArray, desc, or, sql, gte, lte } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStoreFactory = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userUpdates: Partial<User>): Promise<User>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  searchProducts(params: SearchProductsInput): Promise<Product[]>;
  createProduct(product: InsertProduct & { seller_id: number }): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  getCategories(): Promise<string[]>;
  
  // Favorite methods
  addFavorite(userId: number, productId: number): Promise<Favorite>;
  removeFavorite(userId: number, productId: number): Promise<void>;
  getUserFavorites(userId: number): Promise<Product[]>;
  
  // Session store
  sessionStore: session.Store;

  // Cart methods
  getUserCart(userId: number): Promise<(CartItem & { product: Product })[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, item: Partial<InsertCartItem>): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;

  // Purchase methods
  getUserPurchases(userId: number): Promise<(Purchase & { product: Product })[]>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStoreFactory({
      checkPeriod: 86400000,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        password: users.password,
        email: users.email,
        full_name: users.full_name,
        location: users.location,
        avatar_url: users.avatar_url,
        bio: users.bio,
        created_at: users.created_at
      })
      .from(users)
      .where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        password: users.password,
        email: users.email,
        full_name: users.full_name,
        location: users.location,
        avatar_url: users.avatar_url,
        bio: users.bio,
        created_at: users.created_at
      })
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUser(id: number, userUpdates: Partial<User>): Promise<User> {
    // Make sure we don't update sensitive fields
    const { password, id: userId, ...updateData } = userUpdates;
    
    // Convert to database field names
    const dbUpdateData = {
      full_name: updateData.full_name,
      location: updateData.location,
      avatar_url: updateData.avatar_url,
      bio: updateData.bio,
      email: updateData.email
    };
    
    const [updatedUser] = await db
      .update(users)
      .set(dbUpdateData)
      .where(eq(users.id, id))
      .returning();
      
    return updatedUser;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async searchProducts(params: SearchProductsInput): Promise<Product[]> {
    console.log("Searching with params:", params);
    
    const conditions: any[] = [eq(products.active, true)];
    
    // Text search in title and description
    if (params.query && params.query.trim() !== '') {
      const searchQuery = `%${params.query.trim()}%`;
      conditions.push(
        or(
          ilike(products.title, searchQuery),
          ilike(products.description, searchQuery)
        )
      );
    }
    
    // Category filter
    if (params.category && params.category.trim() !== '') {
      conditions.push(eq(products.category, params.category.trim()));
    }
    
    // Price range filter (convert to cents)
    if (params.minPrice !== undefined) {
      conditions.push(gte(products.price, params.minPrice * 100));
    }
    if (params.maxPrice !== undefined) {
      conditions.push(lte(products.price, params.maxPrice * 100));
    }
    
    // Condition filter
    if (params.condition && params.condition.trim() !== '') {
      conditions.push(eq(products.condition, params.condition.trim()));
    }
    
    // Certifications filter
    if (params.certifications && params.certifications.trim() !== '') {
      const certList = params.certifications.split(',').map(c => c.trim());
      conditions.push(sql`${products.certifications} && ${certList}`);
    }

    // Tags filter
    if (params.tags && params.tags.trim() !== '') {
      const tagList = params.tags.split(',').map(t => t.trim());
      conditions.push(sql`${products.tags} && ${tagList}`);
    }
    
    // Location filter
    if (params.location && params.location.trim() !== '') {
      conditions.push(ilike(products.location, `%${params.location.trim()}%`));
    }
    
    // Seller filter
    if (params.seller_id !== undefined) {
      conditions.push(eq(products.seller_id, params.seller_id));
    }

    // Build query
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    // Apply all conditions, sorting, and pagination in a single query
    const result = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        price: products.price,
        category: products.category,
        condition: products.condition,
        image_url: products.image_url,
        tags: products.tags,
        certifications: products.certifications,
        location: products.location,
        seller_id: products.seller_id,
        created_at: products.created_at,
        active: products.active,
      })
      .from(products)
      .where(and(...conditions))
      .orderBy(params.sort_by === 'price_asc' ? products.price
             : params.sort_by === 'price_desc' ? desc(products.price)
             : params.sort_by === 'created_at_asc' ? products.created_at
             : desc(products.created_at))
      .limit(limit)
      .offset(offset);
    
    // Convert prices from cents to dollars in the response
    return result.map(product => ({
      ...product,
      price: product.price / 100,
    }));
  }

  async createProduct(product: InsertProduct & { seller_id: number }): Promise<Product> {
    // Convert price from dollars to cents for storage
    const productWithCents = {
      ...product,
      price: product.price * 100,
      seller_id: product.seller_id
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
        eq(products.seller_id, sellerId),
        eq(products.active, true)
      ))
      .orderBy(desc(products.created_at));
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
    const [existingFavorite] = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.user_id, userId),
          eq(favorites.product_id, productId)
        )
      );

    if (existingFavorite) {
      return existingFavorite;
    }

    const [favorite] = await db
      .insert(favorites)
      .values({
        user_id: userId,
        product_id: productId,
      })
      .returning();

    return favorite;
  }

  async removeFavorite(userId: number, productId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.user_id, userId),
          eq(favorites.product_id, productId)
        )
      );
  }

  async getUserFavorites(userId: number): Promise<Product[]> {
    const favoriteProducts = await db
      .select({
        product: products,
      })
      .from(favorites)
      .innerJoin(products, eq(favorites.product_id, products.id))
      .where(eq(favorites.user_id, userId));

    return favoriteProducts.map(({ product }) => product);
  }

  // Cart methods
  async getUserCart(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = await db
      .select({
        cartItem: cart_items,
        product: products,
      })
      .from(cart_items)
      .innerJoin(products, eq(cart_items.product_id, products.id))
      .where(eq(cart_items.user_id, userId));

    return items.map(({ cartItem, product }) => ({
      ...cartItem,
      product,
    }));
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    const [item] = await db
      .select()
      .from(cart_items)
      .where(eq(cart_items.id, id));
    return item;
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cart_items)
      .where(
        and(
          eq(cart_items.user_id, item.user_id),
          eq(cart_items.product_id, item.product_id)
        )
      );

    if (existingItem) {
      // Update quantity if item exists
      const [updatedItem] = await db
        .update(cart_items)
        .set({
          quantity: (existingItem.quantity || 0) + (item.quantity || 1)
        })
        .where(eq(cart_items.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    // Create new cart item if it doesn't exist
    const [newItem] = await db
      .insert(cart_items)
      .values({
        ...item,
        quantity: item.quantity || 1
      })
      .returning();
    return newItem;
  }

  async updateCartItem(id: number, item: Partial<InsertCartItem>): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cart_items)
      .set(item)
      .where(eq(cart_items.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    await db
      .delete(cart_items)
      .where(eq(cart_items.id, id));
  }

  // Purchase methods
  async getUserPurchases(userId: number): Promise<(Purchase & { product: Product })[]> {
    const userPurchases = await db
      .select({
        purchase: purchases,
        product: products,
      })
      .from(purchases)
      .innerJoin(products, eq(purchases.product_id, products.id))
      .where(eq(purchases.user_id, userId))
      .orderBy(desc(purchases.purchase_date));

    return userPurchases.map(({ purchase, product }) => ({
      ...purchase,
      product,
    }));
  }

  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const [newPurchase] = await db
      .insert(purchases)
      .values(purchase)
      .returning();
    return newPurchase;
  }
}

export const storage = new DatabaseStorage();
