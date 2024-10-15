using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Sales.Domain.Entities;

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

    public virtual DbSet<RequestDetails> RequestDetails { get; set; }

    public virtual DbSet<RequestWorkers> RequestWorkers { get; set; }

    public virtual DbSet<Requests> Requests { get; set; }

    public virtual DbSet<Rooms> Rooms { get; set; }

    public virtual DbSet<ServicePackagePrices> ServicePackagePrices { get; set; }

    public virtual DbSet<ServicePackages> ServicePackages { get; set; }

    public virtual DbSet<WarrantyCards> WarrantyCards { get; set; }

    public virtual DbSet<Workers> Workers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Accounts>(entity =>
        {
            entity.HasKey(e => e.AccountId).HasName("PK__Accounts__349DA5A6433221DB");

            entity.HasIndex(e => e.PhoneNumber, "UQ__Accounts__85FB4E3854006ADF").IsUnique();

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
            entity.HasKey(e => e.AreaId).HasName("PK__Apartmen__70B820483AE70229");

            entity.HasIndex(e => e.Name, "UQ__Apartmen__737584F69C51C97A").IsUnique();

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
                .HasConstraintName("FK__Apartment__Leade__1CBC4616");
        });

        modelBuilder.Entity<Contracts>(entity =>
        {
            entity.HasKey(e => e.ContractId).HasName("PK__Contract__C90D34693CF8C67E");

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
                .HasConstraintName("FK__Contracts__Custo__03F0984C");

            entity.HasOne(d => d.ServicePackage).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.ServicePackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contracts__Servi__208CD6FA");
        });

        modelBuilder.Entity<Customers>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64D84AB8532B");

            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RoomId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Customer).WithOne(p => p.Customers)
                .HasForeignKey<Customers>(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Customers__Custo__18EBB532");

            entity.HasOne(d => d.Room).WithMany(p => p.Customers)
                .HasForeignKey(d => d.RoomId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Customers__RoomI__19DFD96B");
        });

        modelBuilder.Entity<Feedbacks>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD673EFAB8D");

            entity.Property(e => e.FeedbackId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Request).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedbacks__Reque__1DB06A4F");
        });

        modelBuilder.Entity<Leaders>(entity =>
        {
            entity.HasKey(e => e.LeaderId).HasName("PK__Leaders__FCCA6516D8724448");

            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Leader).WithOne(p => p.Leaders)
                .HasForeignKey<Leaders>(d => d.LeaderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Leaders__LeaderI__1BC821DD");
        });

        modelBuilder.Entity<OrderDetails>(entity =>
        {
            entity.HasKey(e => new { e.OrderId, e.ProductId }).HasName("PK__OrderDet__08D097A3388BC27C");

            entity.Property(e => e.OrderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Order__245D67DE");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Produ__236943A5");
        });

        modelBuilder.Entity<Orders>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCF6BBB146C");

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
                .HasConstraintName("FK__Orders__Customer__02084FDA");
        });

        modelBuilder.Entity<PriceRequests>(entity =>
        {
            entity.HasKey(e => e.PriceRequestId).HasName("PK__PriceReq__082B9AAA46C80363");

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
                .HasConstraintName("FK__PriceRequ__Reque__1EA48E88");
        });

        modelBuilder.Entity<ProductPrices>(entity =>
        {
            entity.HasKey(e => e.ProductPriceId).HasName("PK__ProductP__92B9436F2071DA31");

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
                .HasConstraintName("FK__ProductPr__Produ__02FC7413");
        });

        modelBuilder.Entity<Products>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CD4281FD30");

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
            entity.HasKey(e => e.RefreshTokenId).HasName("PK__RefreshT__F5845E398EA59AC4");

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

        modelBuilder.Entity<RequestDetails>(entity =>
        {
            entity.HasKey(e => e.RequestDetailId).HasName("PK__RequestD__DC528B90D97FEBB2");

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
                .HasConstraintName("FK__RequestDe__Reque__1F98B2C1");
        });

        modelBuilder.Entity<RequestWorkers>(entity =>
        {
            entity.HasKey(e => new { e.RequestId, e.WorkerId }).HasName("PK__RequestW__43DF99F845EEA55D");

            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.WorkerId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Request).WithMany(p => p.RequestWorkers)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RequestWo__Reque__25518C17");

            entity.HasOne(d => d.Worker).WithMany(p => p.RequestWorkers)
                .HasForeignKey(d => d.WorkerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RequestWo__Worke__2739D489");
        });

        modelBuilder.Entity<Requests>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Requests__33A8517A5272287C");

            entity.Property(e => e.RequestId)
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
            entity.Property(e => e.Start).HasColumnType("datetime");

            entity.HasOne(d => d.Customer).WithMany(p => p.Requests)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Requests__Custom__00200768");

            entity.HasOne(d => d.Leader).WithMany(p => p.Requests)
                .HasForeignKey(d => d.LeaderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Requests__Leader__01142BA1");
        });

        modelBuilder.Entity<Rooms>(entity =>
        {
            entity.HasKey(e => e.RoomId).HasName("PK__Rooms__328639394790640C");

            entity.Property(e => e.RoomId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.AreaId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RoomCode)
                .HasMaxLength(10)
                .IsUnicode(false);

            entity.HasOne(d => d.Area).WithMany(p => p.Rooms)
                .HasForeignKey(d => d.AreaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Rooms__AreaId__2645B050");
        });

        modelBuilder.Entity<ServicePackagePrices>(entity =>
        {
            entity.HasKey(e => e.ServicePackagePriceId).HasName("PK__ServiceP__290654CCEE8F753D");

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
                .HasConstraintName("FK__ServicePa__Servi__2180FB33");
        });

        modelBuilder.Entity<ServicePackages>(entity =>
        {
            entity.HasKey(e => e.ServicePackageId).HasName("PK__ServiceP__0747A82F52DE1703");

            entity.Property(e => e.ServicePackageId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(255);
        });

        modelBuilder.Entity<WarrantyCards>(entity =>
        {
            entity.HasKey(e => e.WarrantyCardId).HasName("PK__Warranty__3C3D834ACB5E3A9F");

            entity.Property(e => e.WarrantyCardId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ExpireDate).HasColumnType("datetime");
            entity.Property(e => e.OrderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.StartDate).HasColumnType("datetime");

            entity.HasOne(d => d.Order).WithMany(p => p.WarrantyCards)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WarrantyC__Order__22751F6C");
        });

        modelBuilder.Entity<Workers>(entity =>
        {
            entity.HasKey(e => e.WorkerId).HasName("PK__Workers__077C8826B5BBEDB5");

            entity.Property(e => e.WorkerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Leader).WithMany(p => p.Workers)
                .HasForeignKey(d => d.LeaderId)
                .HasConstraintName("FK__Workers__LeaderI__04E4BC85");

            entity.HasOne(d => d.Worker).WithOne(p => p.Workers)
                .HasForeignKey<Workers>(d => d.WorkerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Workers__WorkerI__1AD3FDA4");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
