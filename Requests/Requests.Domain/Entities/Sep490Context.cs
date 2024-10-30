using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Requests.Domain.Entities;

public partial class Sep490Context : DbContext
{
    public Sep490Context()
    {
    }

    public Sep490Context(DbContextOptions<Sep490Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Accounts> Accounts { get; set; }

    public virtual DbSet<ApartmentAreas> ApartmentAreas { get; set; }

    public virtual DbSet<Contracts> Contracts { get; set; }

    public virtual DbSet<Customers> Customers { get; set; }

    public virtual DbSet<Feedbacks> Feedbacks { get; set; }

    public virtual DbSet<Leaders> Leaders { get; set; }

    public virtual DbSet<OrderDetails> OrderDetails { get; set; }

    public virtual DbSet<Orders> Orders { get; set; }

    public virtual DbSet<PriceRequests> PriceRequests { get; set; }

    public virtual DbSet<ProductPrices> ProductPrices { get; set; }

    public virtual DbSet<Products> Products { get; set; }

    public virtual DbSet<RefreshTokens> RefreshTokens { get; set; }

    public virtual DbSet<PendingAccounts> PendingAccounts { get; set; }

    public virtual DbSet<RequestDetails> RequestDetails { get; set; }

    public virtual DbSet<RequestWorkers> RequestWorkers { get; set; }

    public virtual DbSet<Requests> Requests { get; set; }

    public virtual DbSet<Rooms> Rooms { get; set; }

    public virtual DbSet<ServicePackagePrices> ServicePackagePrices { get; set; }

    public virtual DbSet<ServicePackages> ServicePackages { get; set; }

    public virtual DbSet<Transaction> Transaction { get; set; }

    public virtual DbSet<WarrantyCards> WarrantyCards { get; set; }

    public virtual DbSet<WarrantyRequests> WarrantyRequests { get; set; }

    public virtual DbSet<Workers> Workers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Accounts>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Accounts__349DA5A606FC48C0");

            entity.HasIndex(e => e.PhoneNumber, "UQ__Accounts__85FB4E3881791D33").IsUnique();

            entity.Property(e => e.AccountId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.Role)
                .HasMaxLength(10)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ApartmentAreas>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK__Apartmen__70B82048B55FA496");

            entity.HasIndex(e => e.Name, "UQ__Apartmen__737584F63611E7DB").IsUnique();

            entity.Property(e => e.AreaId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ManagementCompany).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);

            entity.HasOne(d => d.Leader).WithMany(p => p.ApartmentAreas)
                .HasForeignKey(d => d.LeaderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Apartment__Leade__74AE54BC");
        });

        modelBuilder.Entity<Contracts>(entity =>
        {
            entity.HasKey(e => e.ContractId).HasName("PK__Contract__C90D3469311802EC");

            entity.Property(e => e.ContractId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.FileUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.PurchaseTime).HasColumnType("datetime");
            entity.Property(e => e.ServicePackageId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Customer).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contracts__Custo__05D8E0BE");

            entity.HasOne(d => d.ServicePackage).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.ServicePackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contracts__Servi__7A672E12");
        });

        modelBuilder.Entity<Customers>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64D8A3EC2681");

            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Customer).WithOne(p => p.Customers)
                .HasForeignKey<Customers>(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Customers__Custo__71D1E811");
        });

        modelBuilder.Entity<Feedbacks>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD6A2F22CAD");

            entity.Property(e => e.FeedbackId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Request).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedbacks__Reque__75A278F5");
        });

        modelBuilder.Entity<Leaders>(entity =>
        {
            entity.HasKey(e => e.LeaderId).HasName("PK__Leaders__FCCA65166A1BE997");

            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Leader).WithOne(p => p.Leaders)
                .HasForeignKey<Leaders>(d => d.LeaderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Leaders__LeaderI__73BA3083");
        });

        modelBuilder.Entity<OrderDetails>(entity =>
        {
            entity.HasKey(e => new { e.OrderId, e.ProductId }).HasName("PK__OrderDet__08D097A389A30A00");

            entity.Property(e => e.OrderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Order__7E37BEF6");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Produ__7D439ABD");
        });

        modelBuilder.Entity<Orders>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCF0DE20696");

            entity.Property(e => e.OrderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.FileUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.PurchaseTime).HasColumnType("datetime");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__Customer__03F0984C");
        });

        modelBuilder.Entity<PriceRequests>(entity =>
        {
            entity.HasKey(e => e.PriceRequestId).HasName("PK__PriceReq__082B9AAA873E6962");

            entity.Property(e => e.PriceRequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Request).WithMany(p => p.PriceRequests)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__PriceRequ__Reque__787EE5A0");
        });

        modelBuilder.Entity<ProductPrices>(entity =>
        {
            entity.HasKey(e => e.ProductPriceId).HasName("PK__ProductP__92B9436F372FF826");

            entity.Property(e => e.ProductPriceId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Product).WithMany(p => p.ProductPrices)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ProductPr__Produ__04E4BC85");
        });

        modelBuilder.Entity<Products>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CDEDC70D18");

            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.InOfStock).HasColumnName("In_Of_Stock");
            entity.Property(e => e.Name).HasMaxLength(255);
        });

        modelBuilder.Entity<RefreshTokens>(entity =>
        {
            entity.HasKey(e => e.RefreshTokenId).HasName("PK__RefreshT__F5845E3988A2E784");

            entity.Property(e => e.RefreshTokenId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.AccountId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ExpiredAt).HasColumnType("datetime");
            entity.Property(e => e.Token)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<PendingAccounts>(entity =>
        {
            entity.HasKey(e => e.PendingAccountId).HasName("PK__PendingA__C1D12B0FCC779856");

            entity.HasIndex(e => e.PhoneNumber, "UQ__PendingA__85FB4E385ECD62CE").IsUnique();

            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.CMT_CCCD)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.AreaId)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<RequestDetails>(entity =>
        {
            entity.HasKey(e => e.RequestDetailId).HasName("PK__RequestD__DC528B900A2D913F");

            entity.Property(e => e.RequestDetailId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Request).WithMany(p => p.RequestDetails)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RequestDe__Reque__797309D9");
        });

        modelBuilder.Entity<RequestWorkers>(entity =>
        {
            entity.HasKey(e => new { e.RequestId, e.WorkerId }).HasName("PK__RequestW__43DF99F8708DE124");

            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.WorkerId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Request).WithMany(p => p.RequestWorkers)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RequestWo__Reque__7F2BE32F");

            entity.HasOne(d => d.Worker).WithMany(p => p.RequestWorkers)
                .HasForeignKey(d => d.WorkerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RequestWo__Worke__01142BA1");
        });

        modelBuilder.Entity<Requests>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Requests__33A8517AB083DD3E");

            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ContractId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.End).HasColumnType("datetime");
            entity.Property(e => e.FileUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.PurchaseTime).HasColumnType("datetime");
            entity.Property(e => e.Start).HasColumnType("datetime");

            entity.HasOne(d => d.Contract).WithMany(p => p.Requests)
                .HasForeignKey(d => d.ContractId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Requests__Contra__778AC167");

            entity.HasOne(d => d.Customer).WithMany(p => p.Requests)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Requests__Custom__02084FDA");

            entity.HasOne(d => d.Leader).WithMany(p => p.Requests)
                .HasForeignKey(d => d.LeaderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Requests__Leader__02FC7413");
        });

        modelBuilder.Entity<Rooms>(entity =>
        {
            entity.HasKey(e => new { e.RoomId, e.AreaId }).HasName("PK__Rooms__A58DBB3DB75986C8");

            entity.Property(e => e.RoomId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.AreaId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Area).WithMany(p => p.Rooms)
                .HasForeignKey(d => d.AreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Rooms__AreaId__00200768");

            entity.HasOne(d => d.Customer).WithMany(p => p.Rooms)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Rooms__CustomerI__76969D2E");
        });

        modelBuilder.Entity<ServicePackagePrices>(entity =>
        {
            entity.HasKey(e => e.ServicePackagePriceId).HasName("PK__ServiceP__290654CC46385663");

            entity.Property(e => e.ServicePackagePriceId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.ServicePackageId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.ServicePackage).WithMany(p => p.ServicePackagePrices)
                .HasForeignKey(d => d.ServicePackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ServicePa__Servi__7B5B524B");
        });

        modelBuilder.Entity<ServicePackages>(entity =>
        {
            entity.HasKey(e => e.ServicePackageId).HasName("PK__ServiceP__0747A82F35D9CE5A");

            entity.Property(e => e.ServicePackageId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(255);
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__Transact__55433A6B59B9BD67");

            entity.Property(e => e.TransactionId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.AccountNumber)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.CounterAccountName).IsUnicode(false);
            entity.Property(e => e.CounterAccountNumber)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.PurchaseTime).HasColumnType("datetime");
            entity.Property(e => e.ServiceId)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WarrantyCards>(entity =>
        {
            entity.HasKey(e => e.WarrantyCardId).HasName("PK__Warranty__3C3D834ABD3ED675");

            entity.Property(e => e.WarrantyCardId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ExpireDate).HasColumnType("datetime");
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.StartDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<WarrantyRequests>(entity =>
        {
            entity.HasKey(e => new { e.WarrantyCardId, e.RequestId }).HasName("PK__Warranty__8F07065DFA1E75A8");

            entity.Property(e => e.WarrantyCardId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Workers>(entity =>
        {
            entity.HasKey(e => e.WorkerId).HasName("PK__Workers__077C88262CCA9807");

            entity.Property(e => e.WorkerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Leader).WithMany(p => p.Workers)
                .HasForeignKey(d => d.LeaderId)
                .HasConstraintName("FK__Workers__LeaderI__06CD04F7");

            entity.HasOne(d => d.Worker).WithOne(p => p.Workers)
                .HasForeignKey<Workers>(d => d.WorkerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Workers__WorkerI__72C60C4A");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
