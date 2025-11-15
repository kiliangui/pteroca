-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "roles" JSONB NOT NULL,
    "password" TEXT,
    "balance" TEXT NOT NULL,
    "name" TEXT,
    "surname" TEXT,
    "pterodactylUserId" INTEGER,
    "pterodactylUserApiKey" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "avatarPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "emailVerified" DATETIME
);

-- CreateTable
CREATE TABLE "category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "diskSpace" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "io" INTEGER NOT NULL,
    "cpu" INTEGER NOT NULL,
    "dbCount" INTEGER NOT NULL,
    "swap" INTEGER NOT NULL,
    "backups" INTEGER NOT NULL,
    "ports" INTEGER NOT NULL,
    "nodes" JSONB,
    "eggs" JSONB,
    "eggsConfiguration" TEXT,
    "allowChangeEgg" BOOLEAN NOT NULL DEFAULT false,
    "schedules" INTEGER NOT NULL DEFAULT 10,
    "threads" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "deletedAt" DATETIME,
    "categoryId" INTEGER,
    CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "product_price_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "server" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pterodactylServerId" INTEGER NOT NULL,
    "pterodactylServerIdentifier" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "autoRenewal" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "server_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "server_product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverId" INTEGER NOT NULL,
    "originalProductId" INTEGER,
    "name" TEXT NOT NULL,
    "diskSpace" INTEGER NOT NULL,
    "memory" INTEGER NOT NULL,
    "io" INTEGER NOT NULL,
    "cpu" INTEGER NOT NULL,
    "dbCount" INTEGER NOT NULL,
    "swap" INTEGER NOT NULL,
    "backups" INTEGER NOT NULL,
    "ports" INTEGER NOT NULL,
    "nodes" JSONB,
    "nest" INTEGER,
    "eggs" JSONB,
    "eggsConfiguration" TEXT,
    "allowChangeEgg" BOOLEAN NOT NULL DEFAULT false,
    "schedules" INTEGER NOT NULL DEFAULT 10,
    "threads" TEXT,
    CONSTRAINT "server_product_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "server" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "server_product_originalProductId_fkey" FOREIGN KEY ("originalProductId") REFERENCES "product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "server_product_price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "serverProductId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "unit" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    CONSTRAINT "server_product_price_serverProductId_fkey" FOREIGN KEY ("serverProductId") REFERENCES "server_product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "status" TEXT,
    "amount" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "balanceAmount" TEXT NOT NULL,
    "usedVoucherId" INTEGER,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "payment_usedVoucherId_fkey" FOREIGN KEY ("usedVoucherId") REFERENCES "voucher" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "voucher" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "maxUses" INTEGER,
    "expiresAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionId" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "password_reset_request" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    CONSTRAINT "password_reset_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "server_log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actionId" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL,
    "serverId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "server_log_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "server" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "server_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "server_subuser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "permissions" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME,
    "serverId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "server_subuser_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "server" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "server_subuser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "context" TEXT,
    "hierarchy" INTEGER NOT NULL DEFAULT 100
);

-- CreateTable
CREATE TABLE "setting_option" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "settingName" TEXT NOT NULL,
    "optionKey" TEXT NOT NULL,
    "optionValue" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "setting_option_settingName_fkey" FOREIGN KEY ("settingName") REFERENCES "setting" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verificationtoken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "server_product_serverId_key" ON "server_product"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "voucher_code_key" ON "voucher"("code");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_request_token_key" ON "password_reset_request"("token");

-- CreateIndex
CREATE UNIQUE INDEX "server_subuser_serverId_userId_key" ON "server_subuser"("serverId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "setting_name_key" ON "setting"("name");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtoken_token_key" ON "verificationtoken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtoken_identifier_token_key" ON "verificationtoken"("identifier", "token");
