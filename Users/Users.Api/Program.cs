using Google.Api;
using HealthChecks.UI.Client;
using MediatR;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using System.Reflection;
using Users.Application.Handlers;
using Users.Application.Mappers;
using Users.Domain.IRepositories;
using Users.Infrastructure.Repositories;

namespace Users.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddAutoMapper(typeof(MapperProfile));
            builder.Services.AddMediatR(config =>
            {
                config.RegisterServicesFromAssemblies(
                    typeof(GetAllRoleHandler).GetTypeInfo().Assembly
                );
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            // Dependency Injection
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddCustomSwaggerGen();
            builder.Services.AddCustomCors();
            builder.AddSqlServerDbContext();
            builder.AddFireBaseConfig();
            builder.AddAppAuthetication();
            builder.Host.IncludeSerilog();
            builder.AddSqlServerHealthCheck();

            // Configure the HTTP request pipeline.
            var app = builder.Build();

            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI(c => 
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "User.Api.v1"));


            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.MapHealthChecks("/sqlserver-healthcheck", new HealthCheckOptions()
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });
            app.Run();
        }
    }
}
