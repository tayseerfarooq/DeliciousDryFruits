import fs from 'fs';
import path from 'path';
import { Database, User, Product, Category, Cart, Order } from './models';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'db.json');

// In-memory lock to prevent concurrent writes
let isWriting = false;
const writeQueue: Array<() => void> = [];

// Read database
export function readDB(): Database {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        // Return empty database structure
        return {
            users: [],
            products: [],
            categories: [],
            carts: [],
            orders: []
        };
    }
}

// Write database with queue to prevent race conditions
async function writeDB(data: Database): Promise<void> {
    return new Promise((resolve, reject) => {
        const doWrite = () => {
            isWriting = true;
            try {
                fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
                isWriting = false;

                // Process next in queue
                const next = writeQueue.shift();
                if (next) next();

                resolve();
            } catch (error) {
                isWriting = false;
                reject(error);
            }
        };

        if (isWriting) {
            writeQueue.push(doWrite);
        } else {
            doWrite();
        }
    });
}

// User operations
export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const db = readDB();
    const newUser: User = {
        ...user,
        id: generateId(),
        createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    await writeDB(db);
    return newUser;
}

export function getUserByEmail(email: string): User | undefined {
    const db = readDB();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
    const db = readDB();
    return db.users.find(u => u.id === id);
}

// Product operations
export function getProducts(filters?: { categoryId?: string; search?: string }): Product[] {
    const db = readDB();
    let products = db.products;

    if (filters?.categoryId) {
        products = products.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower)
        );
    }

    return products;
}

export function getProductById(id: string): Product | undefined {
    const db = readDB();
    return db.products.find(p => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
    const db = readDB();
    return db.products.find(p => p.slug === slug);
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const db = readDB();
    const newProduct: Product = {
        ...product,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    db.products.push(newProduct);
    await writeDB(db);
    return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const db = readDB();
    const index = db.products.findIndex(p => p.id === id);

    if (index === -1) return null;

    db.products[index] = {
        ...db.products[index],
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
    };

    await writeDB(db);
    return db.products[index];
}

export async function deleteProduct(id: string): Promise<boolean> {
    const db = readDB();
    const index = db.products.findIndex(p => p.id === id);

    if (index === -1) return false;

    db.products.splice(index, 1);
    await writeDB(db);
    return true;
}

// Category operations
export function getCategories(): Category[] {
    const db = readDB();
    return db.categories.sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCategoryById(id: string): Category | undefined {
    const db = readDB();
    return db.categories.find(c => c.id === id);
}

export async function createCategory(category: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const db = readDB();
    const newCategory: Category = {
        ...category,
        id: generateId(),
        createdAt: new Date().toISOString()
    };
    db.categories.push(newCategory);
    await writeDB(db);
    return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const db = readDB();
    const index = db.categories.findIndex(c => c.id === id);

    if (index === -1) return null;

    db.categories[index] = {
        ...db.categories[index],
        ...updates,
        id
    };

    await writeDB(db);
    return db.categories[index];
}

export async function deleteCategory(id: string): Promise<boolean> {
    const db = readDB();
    const index = db.categories.findIndex(c => c.id === id);

    if (index === -1) return false;

    db.categories.splice(index, 1);
    await writeDB(db);
    return true;
}

// Cart operations
export function getCart(userId: string): Cart | undefined {
    const db = readDB();
    return db.carts.find(c => c.userId === userId);
}

export async function updateCart(userId: string, items: Cart['items']): Promise<Cart> {
    const db = readDB();
    const index = db.carts.findIndex(c => c.userId === userId);

    const cart: Cart = {
        id: index === -1 ? generateId() : db.carts[index].id,
        userId,
        items,
        updatedAt: new Date().toISOString()
    };

    if (index === -1) {
        db.carts.push(cart);
    } else {
        db.carts[index] = cart;
    }

    await writeDB(db);
    return cart;
}

export async function clearCart(userId: string): Promise<void> {
    const db = readDB();
    const index = db.carts.findIndex(c => c.userId === userId);

    if (index !== -1) {
        db.carts.splice(index, 1);
        await writeDB(db);
    }
}

// Order operations
export function getOrders(userId?: string): Order[] {
    const db = readDB();
    if (userId) {
        return db.orders.filter(o => o.userId === userId).sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return db.orders.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getOrderById(id: string): Order | undefined {
    const db = readDB();
    return db.orders.find(o => o.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
    const db = readDB();
    return db.orders.find(o => o.orderNumber === orderNumber);
}

export async function createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const db = readDB();
    const newOrder: Order = {
        ...order,
        id: generateId(),
        orderNumber: generateOrderNumber(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    db.orders.push(newOrder);
    await writeDB(db);
    return newOrder;
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null> {
    const db = readDB();
    const index = db.orders.findIndex(o => o.id === id);

    if (index === -1) return null;

    db.orders[index] = {
        ...db.orders[index],
        ...updates,
        id,
        updatedAt: new Date().toISOString()
    };

    await writeDB(db);
    return db.orders[index];
}

// Helper functions
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateOrderNumber(): string {
    const prefix = 'DDF';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
}
