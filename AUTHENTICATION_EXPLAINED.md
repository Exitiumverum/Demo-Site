# Authentication System - Detailed Explanation

## Current State: **INCOMPLETE / PLACEHOLDER SYSTEM**

The authentication system is **partially implemented** and has **critical security gaps**. Here's everything you need to know:

---

## 🔐 Authentication Flow Overview

### 1. **Login Process** (`app/login/page.tsx`)

**File**: `app/login/page.tsx`

**What happens:**
1. User submits email and password via form
2. Form uses Next.js Server Action (`handleLogin`)
3. Server Action calls `login()` function from `lib/auth.ts`
4. `login()` queries database to find user by email
5. Compares plain-text password (⚠️ **INSECURE**)
6. If match found → redirects to `/dashboard`
7. If no match → redirects to `/login?error=invalid`

**Critical Issues:**
- ❌ **NO SESSION CREATED** - No cookie is set after successful login
- ❌ **NO PASSWORD HASHING** - Passwords stored/compared in plain text
- ❌ **NO ERROR DISPLAY** - Error parameter in URL but not shown to user
- ❌ **NO LOGOUT FUNCTIONALITY** - Logout button just links to home page

**Code Flow:**
```typescript
// app/login/page.tsx
async function handleLogin(formData: FormData) {
  const user = await login(email, password);  // Checks DB
  if (user) {
    // ❌ MISSING: Set session cookie here
    redirect("/dashboard");  // Just redirects, no session
  }
}
```

---

### 2. **Current User Detection** (`lib/auth.ts`)

**File**: `lib/auth.ts` → `getCurrentUser()`

**What it does NOW:**
```typescript
export async function getCurrentUser(): Promise<User | null> {
  // ❌ PROBLEM: Always returns FIRST user in database
  // ❌ PROBLEM: Not based on any login session
  const user = await db.user.findFirst();
  return user;
}
```

**Critical Issues:**
- ❌ **NO SESSION CHECK** - Doesn't check if user is logged in
- ❌ **ALWAYS RETURNS FIRST USER** - Not user-specific
- ❌ **NO SECURITY** - Anyone can access dashboard if any user exists

**What it SHOULD do:**
```typescript
// Should check for session cookie
const userId = cookies().get("userId")?.value;
if (!userId) return null;
return await db.user.findUnique({ where: { id: userId } });
```

---

### 3. **Active Store Detection** (`lib/auth.ts`)

**File**: `lib/auth.ts` → `getActiveStore()`

**What it does:**
```typescript
export async function getActiveStore() {
  const user = await getCurrentUser();  // Gets first user
  if (!user) return null;
  
  // Returns first store owned by that user
  return await db.store.findFirst({
    where: { ownerId: user.id },
    include: { settings: true },
  });
}
```

**Issues:**
- ⚠️ Depends on broken `getCurrentUser()` 
- ⚠️ Returns first store, not necessarily the "active" one
- ⚠️ No multi-store selection logic

---

### 4. **Dashboard Protection** (`app/(dashboard)/dashboard/layout.tsx`)

**File**: `app/(dashboard)/dashboard/layout.tsx`

**What it does:**
```typescript
export default async function DashboardLayout() {
  const store = await getActiveStore();  // Gets store
  
  if (!store) {
    redirect("/login");  // Redirects if no store found
  }
  // Renders dashboard...
}
```

**Issues:**
- ⚠️ Protection is weak - relies on `getActiveStore()` which always returns first store
- ⚠️ If ANY user/store exists in DB, dashboard is accessible
- ⚠️ No actual authentication check

---

## 📁 Key Files & Their Roles

### **Authentication Files**

1. **`lib/auth.ts`** - Core authentication functions
   - `getCurrentUser()` - Gets current user (BROKEN)
   - `getActiveStore()` - Gets user's store
   - `login()` - Validates credentials (INSECURE)

2. **`app/login/page.tsx`** - Login page
   - Form UI
   - Server Action for login
   - NO session management

3. **`app/(dashboard)/dashboard/layout.tsx`** - Dashboard wrapper
   - Checks for store (weak protection)
   - Redirects to login if no store

### **Database Files**

4. **`lib/db.ts`** - Prisma client singleton
   - Database connection
   - Used by all auth functions

5. **`prisma/schema.prisma`** - Database schema
   - User model (email, password - plain text!)
   - Store model
   - Relationships

### **Protected Routes**

All dashboard routes use `getActiveStore()`:
- `app/(dashboard)/dashboard/page.tsx` - Dashboard home
- `app/(dashboard)/dashboard/products/page.tsx` - Products
- `app/(dashboard)/dashboard/orders/page.tsx` - Orders  
- `app/(dashboard)/dashboard/settings/page.tsx` - Settings

---

## 🔒 Security Issues

### **Critical Problems:**

1. **No Session Management**
   - Login doesn't create a session
   - No way to track who is logged in
   - Every request acts as "first user"

2. **Plain Text Passwords**
   - Passwords stored in database as plain text
   - Password comparison is plain text
   - **NEVER do this in production!**

3. **No Real Authentication**
   - `getCurrentUser()` doesn't check login status
   - Dashboard protection is weak
   - Anyone can access if user exists

4. **No Logout**
   - Logout button just links to home
   - Doesn't clear any session (because there isn't one)

---

## 🔄 How It Currently Works (Step by Step)

### **Scenario: User tries to login**

1. User goes to `/login`
2. Enters email: `admin@example.com`, password: `password123`
3. Clicks "Login"
4. `handleLogin` Server Action runs:
   - Calls `login("admin@example.com", "password123")`
   - Queries: `db.user.findUnique({ where: { email } })`
   - Compares: `user.password === "password123"` (plain text!)
   - If match → redirects to `/dashboard`
   - **BUT**: No cookie/session is set!

5. User arrives at `/dashboard`
6. Dashboard layout calls `getActiveStore()`
7. `getActiveStore()` calls `getCurrentUser()`
8. `getCurrentUser()` does: `db.user.findFirst()` 
   - Returns **first user in database** (not necessarily the one who logged in!)
9. Dashboard renders with that user's first store

### **The Problem:**
- Login validates credentials ✅
- But doesn't create a session ❌
- So `getCurrentUser()` can't know who logged in ❌
- It just returns the first user ❌

---

## 🛠️ What Needs to Be Fixed

### **1. Add Session Management**

**Option A: Simple Cookie-Based (Quick Fix)**
```typescript
// In login handler
const cookieStore = await cookies();
cookieStore.set("userId", user.id, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});

// In getCurrentUser()
const userId = cookieStore.get("userId")?.value;
if (!userId) return null;
return await db.user.findUnique({ where: { id: userId } });
```

**Option B: Proper Auth Library (Recommended)**
- NextAuth.js
- Supabase Auth
- Clerk
- Auth.js

### **2. Add Password Hashing**

**Before storing password:**
```typescript
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash(password, 10);
// Store hashedPassword in database
```

**When comparing:**
```typescript
const isValid = await bcrypt.compare(password, user.password);
```

### **3. Add Logout Functionality**

```typescript
async function handleLogout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  redirect("/login");
}
```

### **4. Add Error Display**

Show error messages to user when login fails.

---

## 📊 Database Schema

**User Table:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // ⚠️ Currently plain text!
  stores    Store[]
  createdAt DateTime @default(now())
}
```

**Store Table:**
```prisma
model Store {
  id          String   @id @default(cuid())
  owner       User     @relation(fields: [ownerId], references: [id])
  ownerId     String
  name        String
  slug        String   @unique
  // ... other fields
}
```

---

## 🎯 Current Behavior Summary

| Action | What Happens | Should Happen |
|--------|-------------|---------------|
| **Login** | Validates credentials, redirects | ✅ Validates ✅ Creates session ❌ |
| **Get Current User** | Returns first user in DB | ❌ Should return logged-in user |
| **Access Dashboard** | Works if any user exists | ❌ Should require login |
| **Logout** | Just links to home | ❌ Should clear session |
| **Password Storage** | Plain text | ❌ Should be hashed |

---

## 🚀 Next Steps

1. **Immediate Fix**: Add cookie-based session management
2. **Security Fix**: Implement password hashing
3. **Proper Auth**: Integrate NextAuth.js or Supabase Auth
4. **Multi-Store**: Add store selection logic
5. **Error Handling**: Show login errors to users

---

## 📝 Files That Need Changes

1. `lib/auth.ts` - Fix `getCurrentUser()` and `login()`
2. `app/login/page.tsx` - Add session creation
3. `app/(dashboard)/dashboard/layout.tsx` - Add logout handler
4. User registration flow (doesn't exist yet)
5. Password hashing utility

---

**Current Status**: ⚠️ **DEVELOPMENT ONLY - NOT PRODUCTION READY**

The system works for basic testing but has no real security. Anyone who knows a user exists can potentially access the dashboard.

