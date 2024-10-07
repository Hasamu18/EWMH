using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Serilog.Events;
using Serilog;
using Serilog.Exceptions;
using System.Reflection;
namespace Logger.LoggingTool
{
    public static class LoggingTool
    {
        public static Action<HostBuilderContext, LoggerConfiguration> ConfigureLogger =>
            (context, loggerConfiguration) =>
            {
                var env = context.HostingEnvironment;             
                loggerConfiguration.MinimumLevel.Error()
                    .Enrich.FromLogContext()
                    .Enrich.WithProperty("ApplicationName", env.ApplicationName)
                    .Enrich.WithProperty("EnvironmentName", env.EnvironmentName)
                    .Enrich.WithExceptionDetails()
                    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Error)
                    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Error)
                    .WriteTo.Debug()
                    .WriteTo.Console()
                    .WriteTo.File($"Logs/{env.ApplicationName}_Logs.txt", rollingInterval: RollingInterval.Day)
                    .WriteTo.MongoDB("mongodb+srv://khoidoan:khoidoan123@cluster0.xqhxcqn.mongodb.net/Logs?retryWrites=true&w=majority",
                                     collectionName: $"{env.ApplicationName}_logs");
            };
    }

}
