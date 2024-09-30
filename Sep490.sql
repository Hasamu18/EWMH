CREATE TABLE [Contracts] (
  [ContractId] varchar(32) NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [ServicePackageId] varchar(32) NOT NULL,
  [FileUrl] varchar(255),
  [PurchaseTime] datetime,
  PRIMARY KEY ([ContractId])
)
GO

CREATE TABLE [Orders] (
  [OrderId] varchar(32) NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [PurchaseTime] datetime,
  [Status] bit,
  [FileUrl] nvarchar(255),
  PRIMARY KEY ([OrderId])
)
GO

CREATE TABLE [WarrantyCards] (
  [WarrantyCardId] varchar(32) NOT NULL,
  [OrderId] varchar(32) NOT NULL,
  [ProductId] nvarchar(255) NOT NULL,
  [StartDate] datetime,
  [ExpireDate] datetime,
  PRIMARY KEY ([WarrantyCardId])
)
GO

CREATE TABLE [Products] (
  [ProductId] varchar(32) NOT NULL,
  [Name] nvarchar(50),
  [Description] text,
  [ImageUrl] varchar(max),
  [In_Of_Stock] int,
  [WarantyMonths] int,
  [Status] bit,
  PRIMARY KEY ([ProductId])
)
GO

CREATE TABLE [Requests] (
  [RequestId] varchar(32) NOT NULL,
  [PriceRequestId] varchar(32) NOT NULL,
  [LeaderId] varchar(32) NOT NULL,
  [CustomerId] varchar(32) NOT NULL,
  [Start] datetime,
  [End] datetime,
  [CustomerProblem] text,
  [Conclusion] text,
  [Status] int,
  [CategoryRequest] int,
  [TotalPrice] int,
  [FileUrl] nvarchar(255),
  PRIMARY KEY ([RequestId])
)
GO

CREATE TABLE [ServicePackages] (
  [ServicePackageId] varchar(32) NOT NULL,
  [Name] nvarchar(50),
  [Description] text,
  [ImageUrl] varchar(max),
  [NumOfRequest] int,
  [Policy] text,
  [Status] bit,
  PRIMARY KEY ([ServicePackageId])
)
GO

CREATE TABLE [Customers] (
  [CustomerId] varchar(32),
  [RoomId] varchar(32),
  PRIMARY KEY ([CustomerId])
)
GO

CREATE TABLE [Workers] (
  [WorkerId] varchar(32),
  [LeaderId] varchar(32) NOT NULL,
  PRIMARY KEY ([WorkerId])
)
GO

CREATE TABLE [Leaders] (
  [LeaderId] varchar(32),
  PRIMARY KEY ([LeaderId])
)
GO

CREATE TABLE [Accounts] (
  [AccountId] varchar(32) NOT NULL,
  [FullName] nvarchar(50),
  [Email] varchar(50),
  [Password] nvarchar(255),
  [PhoneNumber] varchar(11),
  [AvatarUrl] nvarchar(255),
  [DateOfBirth] date,
  [IsDisabled] bit,
  [DisabledReason] text,
  [Role] nvarchar(255),
  PRIMARY KEY ([AccountId])
)
GO

CREATE TABLE [ApartmentAreas] (
  [AreaId] varchar(32) NOT NULL,
  [LeaderId] varchar(32),
  [Name] nvarchar(50) UNIQUE NOT NULL,
  [Description] text,
  [Address] nvarchar(255),
  [ManagementCompany] nvarchar(50),
  PRIMARY KEY ([AreaId])
)
GO

CREATE TABLE [Rooms] (
  [RoomId] varchar(32) NOT NULL,
  [AreaId] varchar(32) NOT NULL,
  [RoomCode] varchar(10) UNIQUE NOT NULL,
  PRIMARY KEY ([RoomId])
)
GO

CREATE TABLE [OrderDetails] (
  [OrderId] varchar(32) NOT NULL,
  [ProductId] varchar(32) NOT NULL,
  [Quantity] int,
  [Price] int,
  [TotalPrice] int,
  PRIMARY KEY ([OrderId], [ProductId])
)
GO

CREATE TABLE [RequestDetails] (
  [RequestId] varchar(32) NOT NULL,
  [ProductId] varchar(32) NOT NULL,
  [Quantity] int,
  [IsCustomerPaying] bit,
  [Description] text,
  PRIMARY KEY ([RequestId], [ProductId])
)
GO

CREATE TABLE [ProductPrices] (
  [ProductPriceId] varchar(32) NOT NULL,
  [ProductId] varchar(32) NOT NULL,
  [Date] datetime,
  [PriceByDate] int,
  PRIMARY KEY ([ProductPriceId])
)
GO

CREATE TABLE [PriceRequests] (
  [PriceRequestId] varchar(32) NOT NULL,
  [Description] varchar(32) NOT NULL,
  [Date] datetime,
  [PriceByDate] int,
  PRIMARY KEY ([PriceRequestId])
)
GO

CREATE TABLE [ServicePackagePrices] (
  [ServicePackagePriceId] varchar(32) NOT NULL,
  [ServicePackageId] varchar(32) NOT NULL,
  [Date] datetime,
  [PriceByDate] int,
  PRIMARY KEY ([ServicePackagePriceId])
)
GO

CREATE TABLE [RequestWorkers] (
  [RequestId] varchar(32) NOT NULL,
  [WorkerId] varchar(32) NOT NULL,
  PRIMARY KEY ([RequestId], [WorkerId])
)
GO

CREATE TABLE [Feedbacks] (
  [FeedbackId] varchar(32) NOT NULL,
  [CustomerId] varchar(32),
  [Content] text,
  [Rate] int,
  [Status] bit,
  PRIMARY KEY ([FeedbackId])
)
GO

ALTER TABLE [Customers] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Accounts] ([AccountId])
GO

ALTER TABLE [Customers] ADD FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([RoomId])
GO

ALTER TABLE [Workers] ADD FOREIGN KEY ([WorkerId]) REFERENCES [Accounts] ([AccountId])
GO

ALTER TABLE [Leaders] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Accounts] ([AccountId])
GO

ALTER TABLE [ApartmentAreas] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Leaders] ([LeaderId])
GO

ALTER TABLE [Feedbacks] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([CustomerId])
GO

ALTER TABLE [Requests] ADD FOREIGN KEY ([PriceRequestId]) REFERENCES [PriceRequests] ([PriceRequestId])
GO

ALTER TABLE [RequestDetails] ADD FOREIGN KEY ([RequestId]) REFERENCES [Requests] ([RequestId])
GO

ALTER TABLE [RequestDetails] ADD FOREIGN KEY ([ProductId]) REFERENCES [Products] ([ProductId])
GO

ALTER TABLE [Contracts] ADD FOREIGN KEY ([ServicePackageId]) REFERENCES [ServicePackages] ([ServicePackageId])
GO

ALTER TABLE [ServicePackagePrices] ADD FOREIGN KEY ([ServicePackageId]) REFERENCES [ServicePackages] ([ServicePackageId])
GO

ALTER TABLE [WarrantyCards] ADD FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([OrderId])
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

ALTER TABLE [Contracts] ADD FOREIGN KEY ([CustomerId]) REFERENCES [Customers] ([CustomerId])
GO

ALTER TABLE [Workers] ADD FOREIGN KEY ([LeaderId]) REFERENCES [Leaders] ([LeaderId])
GO
