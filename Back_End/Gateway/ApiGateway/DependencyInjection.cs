using Serilog;
using Ocelot.Provider.Kubernetes;
using Ocelot.Cache.CacheManager;
using Ocelot.DependencyInjection;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Logger.LoggingTool;
namespace Gateway.ApiGateway
{
    public static class DependencyInjection
    {
        public static void IncludeSerilog(this IHostBuilder builder)
        {
            builder.UseSerilog(LoggingTool.ConfigureLogger);
        }

        public static void AddCustomCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowAnyOrigin();
                });
            });
        }

        public static void AddApiGateway(this IServiceCollection services)
        {
            services.AddOcelot()
                .AddKubernetes()
                .AddCacheManager(o => o.WithDictionaryHandle());
        }

        public static void AddEnvironmentOcelotFile(this WebApplicationBuilder builder)
        {
            builder.Configuration.AddJsonFile($"ocelot.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true);
        }
    }
}
