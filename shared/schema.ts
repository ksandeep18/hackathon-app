import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  full_name: text("full_name"),
  location: text("location"),
  avatar_url: text("avatar_url"),
  bio: text("bio"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  favorites: many(favorites),
  cart_items: many(cart_items),
  purchases: many(purchases),
}));

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in cents
  category: text("category").notNull(),
  condition: text("condition").notNull(),
  image_url: text("image_url"),
  tags: text("tags").array(),
  certifications: text("certifications").array(),
  location: text("location"),
  seller_id: integer("seller_id").notNull().references(() => users.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.seller_id],
    references: [users.id],
  }),
  favorites: many(favorites),
}));

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  product_id: integer("product_id").notNull().references(() => products.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.user_id],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.product_id],
    references: [products.id],
  }),
}));

export const cart_items = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  product_id: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const cartItemsRelations = relations(cart_items, ({ one }) => ({
  user: one(users, {
    fields: [cart_items.user_id],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cart_items.product_id],
    references: [products.id],
  }),
}));

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  product_id: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(), // Price at time of purchase in cents
  status: text("status").notNull().default("completed"),
  purchase_date: timestamp("purchase_date").defaultNow().notNull(),
});

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.user_id],
    references: [users.id],
  }),
  product: one(products, {
    fields: [purchases.product_id],
    references: [products.id],
  }),
}));

// Types for database models
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LoginUser = z.infer<typeof loginUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type SearchProductsInput = z.infer<typeof searchProductsSchema>;

export type Favorite = typeof favorites.$inferSelect;
export type CartItem = typeof cart_items.$inferSelect;
export type InsertCartItem = typeof cart_items.$inferInsert;

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

// Zod schemas for form validation
export const insertUserSchema = createInsertSchema(users, {
  full_name: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(1, "Password is required"),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  created_at: true,
  seller_id: true,
}).extend({
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  image_url: z.string().optional(),
  tags: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  location: z.string().optional(),
  active: z.boolean().optional().default(true),
});

export const searchProductsSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  condition: z.string().optional(),
  certifications: z.string().optional(),
  seller_id: z.coerce.number().optional(),
  tags: z.string().optional(),
  location: z.string().optional(),
  sort_by: z.enum(['price_asc', 'price_desc', 'created_at_desc', 'created_at_asc']).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(50).optional().default(20),
}).superRefine((data, ctx) => {
  if (data.minPrice !== undefined && data.maxPrice !== undefined && data.minPrice > data.maxPrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Minimum price cannot be greater than maximum price",
      path: ["minPrice"],
    });
  }
});

export const insertCartItemSchema = createInsertSchema(cart_items, {
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
}).omit({
  id: true,
  created_at: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases, {
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
}).omit({
  id: true,
  purchase_date: true,
});
