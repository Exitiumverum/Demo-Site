-- Run this SQL in Supabase SQL Editor to create the schema
-- Go to: Supabase Dashboard > SQL Editor > New Query

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Create Store table
CREATE TABLE IF NOT EXISTS "Store" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS "Store_slug_key" ON "Store"("slug");

-- Create foreign key for Store.ownerId
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Store_ownerId_fkey'
    ) THEN
        ALTER TABLE "Store" ADD CONSTRAINT "Store_ownerId_fkey" 
            FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- Create StoreSettings table
CREATE TABLE IF NOT EXISTS "StoreSettings" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "paymentProvider" TEXT,
    "paymentPublicKey" TEXT,
    "paymentSecretKey" TEXT,
    "paymentRedirectUrl" TEXT,
    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);

-- Create unique index on storeId
CREATE UNIQUE INDEX IF NOT EXISTS "StoreSettings_storeId_key" ON "StoreSettings"("storeId");

-- Create foreign key for StoreSettings.storeId
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'StoreSettings_storeId_fkey'
    ) THEN
        ALTER TABLE "StoreSettings" ADD CONSTRAINT "StoreSettings_storeId_fkey" 
            FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create Product table
CREATE TABLE IF NOT EXISTS "Product" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for Product.storeId
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Product_storeId_fkey'
    ) THEN
        ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" 
            FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create Order table
CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "items" JSONB NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- Create foreign key for Order.storeId
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Order_storeId_fkey'
    ) THEN
        ALTER TABLE "Order" ADD CONSTRAINT "Order_storeId_fkey" 
            FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

