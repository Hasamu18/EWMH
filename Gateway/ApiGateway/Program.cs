using Ocelot.Middleware;

namespace Gateway.ApiGateway
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configure services
            builder.Host.IncludeSerilog();
            builder.Services.AddCustomCors();
            builder.Services.AddApiGateway();
            builder.AddEnvironmentOcelotFile();

            var app = builder.Build();

            // Configure pipeline


            app.UseRouting();
            app.UseCors("CorsPolicy");

#pragma warning disable ASP0014 // Suggest using top level route registrations
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context => 
                {
                    await context.Response.WriteAsync("Api Gateway is running");
                });
            });
#pragma warning restore ASP0014 // Suggest using top level route registrations

            app.UseOcelot().GetAwaiter().GetResult();

            app.Run();
        }
    }
}
