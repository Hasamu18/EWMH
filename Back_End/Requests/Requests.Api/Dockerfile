#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Requests/Requests.Api/Requests.Api.csproj", "Requests/Requests.Api/"]
COPY ["Infrastructure/Logger/Logger.csproj", "Infrastructure/Logger/"]
COPY ["Requests/Requests.Application/Requests.Application.csproj", "Requests/Requests.Application/"]
COPY ["Requests/Requests.Domain/Requests.Domain.csproj", "Requests/Requests.Domain/"]
COPY ["Requests/Requests.Infrastructure/Requests.Infrastructure.csproj", "Requests/Requests.Infrastructure/"]
RUN dotnet restore "./Requests/Requests.Api/Requests.Api.csproj"
COPY . .
WORKDIR "/src/Requests/Requests.Api"
RUN dotnet build "./Requests.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Requests.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Requests.Api.dll"]