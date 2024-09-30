using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Users.Domain.Entities;

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

    public virtual DbSet<RequestDetails> RequestDetails { get; set; }

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
            entity.HasKey(e => e.AccountId).HasName("PK__Accounts__349DA5A68C0F63CB");

            entity.Property(e => e.AccountId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.AvatarUrl).HasMaxLength(255);
            entity.Property(e => e.DisabledReason).HasColumnType("text");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(50);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(11)
                .IsUnicode(false);
            entity.Property(e => e.Role).HasMaxLength(255);
        });

        modelBuilder.Entity<ApartmentAreas>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK__Apartmen__70B8204838EA211B");

            entity.HasIndex(e => e.Name, "UQ__Apartmen__737584F6222E7E0B").IsUnique();

            entity.Property(e => e.AreaId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ManagementCompany).HasMaxLength(50);
            entity.Property(e => e.Name).HasMaxLength(50);

            entity.HasOne(d => d.Leader).WithMany(p => p.ApartmentAreas)
                .HasForeignKey(d => d.LeaderId)
                .HasConstraintName("FK__Apartment__Leade__71D1E811");
        });

        modelBuilder.Entity<Contracts>(entity =>
        {
            entity.HasKey(e => e.ContractId).HasName("PK__Contract__C90D3469AFA16E4F");

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
                .HasConstraintName("FK__Contracts__Custo__02084FDA");

            entity.HasOne(d => d.ServicePackage).WithMany(p => p.Contracts)
                .HasForeignKey(d => d.ServicePackageId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Contracts__Servi__76969D2E");
        });

        modelBuilder.Entity<Customers>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64D872419D93");

            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.RoomId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Customer).WithOne(p => p.Customers)
                .HasForeignKey<Customers>(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Customers__Custo__6E01572D");

            entity.HasOne(d => d.Room).WithMany(p => p.Customers)
                .HasForeignKey(d => d.RoomId)
                .HasConstraintName("FK__Customers__RoomI__6EF57B66");
        });

        modelBuilder.Entity<Feedbacks>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD678559311");

            entity.Property(e => e.FeedbackId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Customer).WithMany(p => p.Feedbacks)
                .HasForeignKey(d => d.CustomerId)
                .HasConstraintName("FK__Feedbacks__Custo__72C60C4A");
        });

        modelBuilder.Entity<Leaders>(entity =>
        {
            entity.HasKey(e => e.LeaderId).HasName("PK__Leaders__FCCA651679DA174D");

            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Leader).WithOne(p => p.Leaders)
                .HasForeignKey<Leaders>(d => d.LeaderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Leaders__LeaderI__70DDC3D8");
        });

        modelBuilder.Entity<OrderDetails>(entity =>
        {
            entity.HasKey(e => new { e.OrderId, e.ProductId }).HasName("PK__OrderDet__08D097A3978BE9A3");

            entity.Property(e => e.OrderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Order__7A672E12");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Produ__797309D9");
        });

        modelBuilder.Entity<Orders>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BCF948BA272");

            entity.Property(e => e.OrderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.FileUrl).HasMaxLength(255);
            entity.Property(e => e.PurchaseTime).HasColumnType("datetime");

            entity.HasOne(d => d.Customer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__Customer__00200768");
        });

        modelBuilder.Entity<PriceRequests>(entity =>
        {
            entity.HasKey(e => e.PriceRequestId).HasName("PK__PriceReq__082B9AAA0752DA67");

            entity.Property(e => e.PriceRequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Date).HasColumnType("datetime");
            entity.Property(e => e.Description)
                .HasMaxLength(32)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ProductPrices>(entity =>
        {
            entity.HasKey(e => e.ProductPriceId).HasName("PK__ProductP__92B9436F9F076212");

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
                .HasConstraintName("FK__ProductPr__Produ__01142BA1");
        });

        modelBuilder.Entity<Products>(entity =>
        {
            entity.HasKey(e => e.ProductId).HasName("PK__Products__B40CC6CD3AC9DE36");

            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.ImageUrl).IsUnicode(false);
            entity.Property(e => e.InOfStock).HasColumnName("In_Of_Stock");
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<RequestDetails>(entity =>
        {
            entity.HasKey(e => new { e.RequestId, e.ProductId }).HasName("PK__RequestD__F8E89D16A9577530");

            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ProductId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasColumnType("text");

            entity.HasOne(d => d.Product).WithMany(p => p.RequestDetails)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RequestDe__Produ__75A278F5");

            entity.HasOne(d => d.Request).WithMany(p => p.RequestDetails)
                .HasForeignKey(d => d.RequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__RequestDe__Reque__74AE54BC");
        });

        modelBuilder.Entity<Requests>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Requests__33A8517AD064012D");

            entity.Property(e => e.RequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Conclusion).HasColumnType("text");
            entity.Property(e => e.CustomerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.CustomerProblem).HasColumnType("text");
            entity.Property(e => e.End).HasColumnType("datetime");
            entity.Property(e => e.FileUrl).HasMaxLength(255);
            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.PriceRequestId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Start).HasColumnType("datetime");

            entity.HasOne(d => d.Customer).WithMany(p => p.Requests)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Requests__Custom__7E37BEF6");

            entity.HasOne(d => d.Leader).WithMany(p => p.Requests)
                .HasForeignKey(d => d.LeaderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Requests__Leader__7F2BE32F");

            entity.HasOne(d => d.PriceRequest).WithMany(p => p.Requests)
                .HasForeignKey(d => d.PriceRequestId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Requests__PriceR__73BA3083");

            entity.HasMany(d => d.Worker).WithMany(p => p.Request)
                .UsingEntity<Dictionary<string, object>>(
                    "RequestWorkers",
                    r => r.HasOne<Workers>().WithMany()
                        .HasForeignKey("WorkerId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__RequestWo__Worke__7D439ABD"),
                    l => l.HasOne<Requests>().WithMany()
                        .HasForeignKey("RequestId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__RequestWo__Reque__7B5B524B"),
                    j =>
                    {
                        j.HasKey("RequestId", "WorkerId").HasName("PK__RequestW__43DF99F85F2E3D1C");
                        j.IndexerProperty<string>("RequestId")
                            .HasMaxLength(32)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("WorkerId")
                            .HasMaxLength(32)
                            .IsUnicode(false);
                    });
        });

        modelBuilder.Entity<Rooms>(entity =>
        {
            entity.HasKey(e => e.RoomId).HasName("PK__Rooms__3286393969D291C6");

            entity.HasIndex(e => e.RoomCode, "UQ__Rooms__4F9D523106920F82").IsUnique();

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
                .HasConstraintName("FK__Rooms__AreaId__7C4F7684");
        });

        modelBuilder.Entity<ServicePackagePrices>(entity =>
        {
            entity.HasKey(e => e.ServicePackagePriceId).HasName("PK__ServiceP__290654CC09F8ABDD");

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
                .HasConstraintName("FK__ServicePa__Servi__778AC167");
        });

        modelBuilder.Entity<ServicePackages>(entity =>
        {
            entity.HasKey(e => e.ServicePackageId).HasName("PK__ServiceP__0747A82F303326E8");

            entity.Property(e => e.ServicePackageId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.ImageUrl).IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(50);
            entity.Property(e => e.Policy).HasColumnType("text");
        });

        modelBuilder.Entity<WarrantyCards>(entity =>
        {
            entity.HasKey(e => e.WarrantyCardId).HasName("PK__Warranty__3C3D834A7D59DD83");

            entity.Property(e => e.WarrantyCardId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ExpireDate).HasColumnType("datetime");
            entity.Property(e => e.OrderId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.ProductId).HasMaxLength(255);
            entity.Property(e => e.StartDate).HasColumnType("datetime");

            entity.HasOne(d => d.Order).WithMany(p => p.WarrantyCards)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__WarrantyC__Order__787EE5A0");
        });

        modelBuilder.Entity<Workers>(entity =>
        {
            entity.HasKey(e => e.WorkerId).HasName("PK__Workers__077C88266E3C2199");

            entity.Property(e => e.WorkerId)
                .HasMaxLength(32)
                .IsUnicode(false);
            entity.Property(e => e.LeaderId)
                .HasMaxLength(32)
                .IsUnicode(false);

            entity.HasOne(d => d.Leader).WithMany(p => p.Workers)
                .HasForeignKey(d => d.LeaderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Workers__LeaderI__02FC7413");

            entity.HasOne(d => d.Worker).WithOne(p => p.Workers)
                .HasForeignKey<Workers>(d => d.WorkerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Workers__WorkerI__6FE99F9F");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
