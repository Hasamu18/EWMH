CREATE TABLE [Contracts] (
  [ContractId] varchar(32) NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [ServicePackageId] varchar(32) NOT NULL,
  [FileUrl] varchar(255),
  [PurchaseTime] datetime,
  [RemainingNumOfRequests] int NOT NULL,
  [OrderCode] bigint,
  [IsOnlinePayment] int NOT NULL,
  [TotalPrice] int,
  [ExpireDate] datetime,
  PRIMARY KEY ([ContractId])
)
GO

CREATE TABLE [Orders] (
  [OrderId] varchar(32) NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [PurchaseTime] datetime,
  [Status] bit NOT NULL,
  [FileUrl] varchar(255),
  [OrderCode] bigint,
  PRIMARY KEY ([OrderId])
)
GO

CREATE TABLE [Shipping] (
  [ShippingId] varchar(32) NOT NULL,
  [LeaderId] varchar(32) NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [WorkerId] varchar(32),
  [ShipmentDate] datetime,
  [DeliveriedDate] datetime,
  [Status] int NOT NULL,
  [CustomerNote] nvarchar(max),
  [ProofFileUrl] varchar(255),
  [Address] varchar(32),
  PRIMARY KEY ([ShippingId])
)
GO

CREATE TABLE [WarrantyCards] (
  [WarrantyCardId] varchar(32) NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [ProductId] varchar(32) NOT NULL,
  [StartDate] datetime NOT NULL,
  [ExpireDate] datetime NOT NULL,
  PRIMARY KEY ([WarrantyCardId])
)
GO

CREATE TABLE [WarrantyRequests] (
  [WarrantyCardId] varchar(32) NOT NULL,
  [RequestId] varchar(32) NOT NULL,
  PRIMARY KEY ([WarrantyCardId], [RequestId])
)
GO

CREATE TABLE [Products] (
  [ProductId] varchar(32) NOT NULL,
  [Name] nvarchar(255) NOT NULL,
  [Description] nvarchar(max) NOT NULL,
  [ImageUrl] varchar(255) NOT NULL,
  [In_Of_Stock] int NOT NULL,
  [WarantyMonths] int NOT NULL,
  [Status] bit NOT NULL,
  PRIMARY KEY ([ProductId])
)
GO

CREATE TABLE [Requests] (
  [RequestId] varchar(32) NOT NULL,
  [LeaderId] varchar(32) NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [ContractId] varchar(32),
  [RoomId] varchar(32) NOT NULL,
  [Start] datetime NOT NULL,
  [End] datetime,
  [CustomerProblem] nvarchar(max) NOT NULL,
  [Conclusion] nvarchar(max),
  [Status] int NOT NULL,
  [CategoryRequest] int NOT NULL,
  [PurchaseTime] datetime,
  [TotalPrice] int,
  [FileUrl] varchar(255),
  [PreRepairEvidenceUrl] varchar(255),
  [PostRepairEvidenceUrl] varchar(255),
  [OrderCode] bigint,
  [IsOnlinePayment] bit,
  PRIMARY KEY ([RequestId])
)
GO

CREATE TABLE [ServicePackages] (
  [ServicePackageId] varchar(32) NOT NULL,
  [Name] nvarchar(255) NOT NULL,
  [Description] nvarchar(255) NOT NULL,
  [ImageUrl] varchar(255) NOT NULL,
  [NumOfRequest] int NOT NULL,
  [Policy] nvarchar(max) NOT NULL,
  [Status] bit NOT NULL,
  PRIMARY KEY ([ServicePackageId])
)
GO

CREATE TABLE [Customers] (
  [CustomerId] varchar(32) NOT NULL,
  [CMT_CCCD] varchar(32) NOT NULL,
  PRIMARY KEY ([CustomerId])
)
GO

CREATE TABLE [Workers] (
  [WorkerId] varchar(32) NOT NULL,
  [LeaderId] varchar(32),
  PRIMARY KEY ([WorkerId])
)
GO

CREATE TABLE [Leaders] (
  [LeaderId] varchar(32) NOT NULL,
  PRIMARY KEY ([LeaderId])
)
GO

CREATE TABLE [Accounts] (
  [AccountId] varchar(32) NOT NULL,
  [FullName] nvarchar(255) NOT NULL,
  [Email] varchar(255) NOT NULL,
  [Password] varchar(255) NOT NULL,
  [PhoneNumber] varchar(11) UNIQUE NOT NULL,
  [AvatarUrl] varchar(255) NOT NULL,
  [DateOfBirth] date NOT NULL,
  [IsDisabled] bit NOT NULL,
  [DisabledReason] nvarchar(max),
  [Role] varchar(10) NOT NULL,
  PRIMARY KEY ([AccountId])
)
GO

CREATE TABLE [ApartmentAreas] (
  [AreaId] varchar(32) NOT NULL,
  [LeaderId] varchar(32) NOT NULL,
  [Name] nvarchar(255) UNIQUE NOT NULL,
  [Description] nvarchar(max) NOT NULL,
  [Address] nvarchar(max) NOT NULL,
  [ManagementCompany] nvarchar(255) NOT NULL,
  [AvatarUrl] varchar(255) NOT NULL,
  [ProofFileUrl] varchar(255),
  PRIMARY KEY ([AreaId])
)
GO

CREATE TABLE [LeaderHistory] (
  [LeaderHistoryId] varchar(32) NOT NULL,
  [AreaId] varchar(32) NOT NULL,
  [LeaderId] varchar(32) NOT NULL,
  [From] datetime NOT NULL,
  [To] datetime,
  PRIMARY KEY ([LeaderHistoryId])
)
GO

CREATE TABLE [WorkerHistory] (
  [WorkerHistoryId] varchar(32) NOT NULL,
  [LeaderId] varchar(32) NOT NULL,
  [WorkerId] varchar(32) NOT NULL,
  [From] datetime NOT NULL,
  [To] datetime,
  PRIMARY KEY ([WorkerHistoryId])
)
GO

CREATE TABLE [Rooms] (
  [RoomId] varchar(32) NOT NULL,
  [AreaId] varchar(32) NOT NULL,
  [CustomerId] varchar(32),
  PRIMARY KEY ([RoomId], [AreaId])
)
GO

CREATE TABLE [RefreshTokens] (
  [RefreshTokenId] varchar(32) NOT NULL,
  [AccountId] varchar(32) NOT NULL,
  [Token] varchar(32) NOT NULL,
  [ExpiredAt] datetime NOT NULL,
  PRIMARY KEY ([RefreshTokenId])
)
GO

CREATE TABLE [PendingAccounts] (
  [PendingAccountId] varchar(32) NOT NULL,
  [FullName] nvarchar(255) NOT NULL,
  [Email] varchar(255) NOT NULL,
  [Password] varchar(255) NOT NULL,
  [PhoneNumber] varchar(11) UNIQUE NOT NULL,
  [DateOfBirth] date NOT NULL,
  [CMT_CCCD] varchar(32) NOT NULL,
  [AreaId] varchar(32) NOT NULL,
  PRIMARY KEY ([PendingAccountId])
)
GO

CREATE TABLE [Transaction] (
  [TransactionId] varchar(32),
  [ServiceType] int NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [AccountNumber] varchar(32),
  [CounterAccountNumber] varchar(32),
  [CounterAccountName] varchar(max),
  [PurchaseTime] datetime NOT NULL,
  [OrderCode] bigint,
  [Amount] int NOT NULL,
  [Description] varchar(max),
  PRIMARY KEY ([TransactionId])
)
GO

CREATE TABLE [OrderDetails] (
  [OrderId] varchar[32] NOT NULL,
  [ProductId] varchar(32) NOT NULL,
  [Quantity] int NOT NULL,
  [Price] int NOT NULL,
  [TotalPrice] int NOT NULL,
  PRIMARY KEY ([OrderId], [ProductId])
)
GO

CREATE TABLE [AttachedOrders] (
  [AttachedOrderId] varchar[32] NOT NULL,
  [RequestId] varchar[32] NOT NULL,
  [ProductId] varchar(32) NOT NULL,
  [Quantity] int NOT NULL,
  [Description] nvarchar(max) NOT NULL,
  PRIMARY KEY ([AttachedOrderId])
)
GO

CREATE TABLE [ProductPrices] (
  [ProductPriceId] varchar(32) NOT NULL,
  [ProductId] varchar(32) NOT NULL,
  [Date] datetime NOT NULL,
  [PriceByDate] int NOT NULL,
  PRIMARY KEY ([ProductPriceId])
)
GO

CREATE TABLE [RequestPrices] (
  [RequestPriceId] varchar(32) NOT NULL,
  [RequestId] varchar(32) NOT NULL,
  [Date] datetime NOT NULL,
  [PriceByDate] int NOT NULL,
  PRIMARY KEY ([RequestPriceId])
)
GO

CREATE TABLE [RequestPriceHistory] (
  [RequestPriceId] varchar(32) NOT NULL,
  [RequestId] varchar(32) NOT NULL,
  PRIMARY KEY ([RequestPriceId], [RequestId])
)
GO

CREATE TABLE [ServicePackagePrices] (
  [ServicePackagePriceId] varchar(32) NOT NULL,
  [ServicePackageId] varchar(32) NOT NULL,
  [Date] datetime NOT NULL,
  [PriceByDate] int NOT NULL,
  PRIMARY KEY ([ServicePackagePriceId])
)
GO

CREATE TABLE [RequestWorkers] (
  [RequestId] varchar(32) NOT NULL,
  [WorkerId] varchar(32) NOT NULL,
  [IsLead] bit NOT NULL,
  PRIMARY KEY ([RequestId], [WorkerId])
)
GO

CREATE TABLE [Feedbacks] (
  [FeedbackId] varchar(32) NOT NULL,
  [RequestId] varchar(32) NOT NULL,
  [Content] nvarchar(max) NOT NULL,
  [Rate] int NOT NULL,
  [Status] bit NOT NULL,
  PRIMARY KEY ([FeedbackId])
)
GO

ALTER TABLE [Shipping] ADD FOREIGN KEY ([ShippingId]) REFERENCES [Orders] ([OrderId])
GO

ALTER TABLE [Customers] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Accounts] ([AccountId])
GO

ALTER TABLE [Workers] ADD FOREIGN KEY ([WorkerId]) REFERENCES [Accounts] ([AccountId])
GO

ALTER TABLE [Leaders] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Accounts] ([AccountId])
GO

ALTER TABLE [ApartmentAreas] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Leaders] ([LeaderId])
GO

ALTER TABLE [Transaction] ADD FOREIGN KEY ([TransactionId]) REFERENCES [Orders] ([OrderId])
GO

ALTER TABLE [Transaction] ADD FOREIGN KEY ([TransactionId]) REFERENCES [Contracts] ([ContractId])
GO

ALTER TABLE [Transaction] ADD FOREIGN KEY ([TransactionId]) REFERENCES [Requests] ([RequestId])
GO

ALTER TABLE [Feedbacks] ADD FOREIGN KEY ([RequestId]) REFERENCES [Requests] ([RequestId])
GO

ALTER TABLE [LeaderHistory] ADD FOREIGN KEY ([AreaId]) REFERENCES [ApartmentAreas] ([AreaId])
GO

ALTER TABLE [LeaderHistory] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Leaders] ([LeaderId])
GO

ALTER TABLE [WorkerHistory] ADD FOREIGN KEY ([WorkerId]) REFERENCES [Workers] ([WorkerId])
GO

ALTER TABLE [WorkerHistory] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Leaders] ([LeaderId])
GO

ALTER TABLE [WarrantyRequests] ADD FOREIGN KEY ([WarrantyCardId]) REFERENCES [WarrantyCards] ([WarrantyCardId])
GO

ALTER TABLE [WarrantyRequests] ADD FOREIGN KEY ([RequestId]) REFERENCES [Requests] ([RequestId])
GO

ALTER TABLE [Rooms] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([CustomerId])
GO

ALTER TABLE [Shipping] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([CustomerId])
GO

ALTER TABLE [Shipping] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Leaders] ([LeaderId])
GO

ALTER TABLE [Shipping] ADD FOREIGN KEY ([WorkerId]) REFERENCES [Workers] ([WorkerId])
GO

ALTER TABLE [Requests] ADD FOREIGN KEY ([ContractId]) REFERENCES [Contracts] ([ContractId])
GO

ALTER TABLE [RequestPriceHistory] ADD FOREIGN KEY ([RequestId]) REFERENCES [Requests] ([RequestId])
GO

ALTER TABLE [RequestPriceHistory] ADD FOREIGN KEY ([RequestPriceId]) REFERENCES [RequestPrices] ([RequestPriceId])
GO

ALTER TABLE [AttachedOrders] ADD FOREIGN KEY ([RequestId]) REFERENCES [Requests] ([RequestId])
GO

ALTER TABLE [Contracts] ADD FOREIGN KEY ([ServicePackageId]) REFERENCES [ServicePackages] ([ServicePackageId])
GO

ALTER TABLE [ServicePackagePrices] ADD FOREIGN KEY ([ServicePackageId]) REFERENCES [ServicePackages] ([ServicePackageId])
GO

ALTER TABLE [WarrantyCards] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([CustomerId])
GO

ALTER TABLE [OrderDetails] ADD FOREIGN KEY ([ProductId]) REFERENCES [Products] ([ProductId])
GO

ALTER TABLE [OrderDetails] ADD FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([OrderId])
GO

ALTER TABLE [RequestWorkers] ADD FOREIGN KEY ([RequestId]) REFERENCES [Requests] ([RequestId])
GO

ALTER TABLE [Rooms] ADD FOREIGN KEY ([AreaId]) REFERENCES [ApartmentAreas] ([AreaId])
GO

ALTER TABLE [RequestWorkers] ADD FOREIGN KEY ([WorkerId]) REFERENCES [Workers] ([WorkerId])
GO

ALTER TABLE [Requests] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([CustomerId])
GO

ALTER TABLE [Requests] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Leaders] ([LeaderId])
GO

ALTER TABLE [Orders] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([CustomerId])
GO

ALTER TABLE [ProductPrices] ADD FOREIGN KEY ([ProductId]) REFERENCES [Products] ([ProductId])
GO

ALTER TABLE [AttachedOrders] ADD FOREIGN KEY ([ProductId]) REFERENCES [Products] ([ProductId])
GO

ALTER TABLE [Contracts] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([CustomerId])
GO

ALTER TABLE [Workers] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Leaders] ([LeaderId])
GO
