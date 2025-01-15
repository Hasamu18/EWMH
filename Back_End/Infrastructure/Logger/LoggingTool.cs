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
            .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Error);

        if (env.IsProduction() || env.IsEnvironment("Docker"))
        {
            loggerConfiguration
                .WriteTo.MongoDB("mongodb+srv://khoidoan:khoidoan123@cluster0.xqhxcqn.mongodb.net/Logs?retryWrites=true&w=majority",
                                 collectionName: $"{env.ApplicationName}");
        }
        else
        {
            loggerConfiguration
                .WriteTo.Debug()
                .WriteTo.Console()
                .WriteTo.File($"Logs/{env.ApplicationName}.txt", rollingInterval: RollingInterval.Day);
        }
    };

    }
}
