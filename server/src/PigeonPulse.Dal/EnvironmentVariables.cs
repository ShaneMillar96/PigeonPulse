using PigeonPulse.Dal.Extensions;

namespace PigeonPulse.Dal;

public static class EnvironmentVariables
{
    private static string DbConnectionStringKey => "DbConnectionString";

    public static string? DbConnectionString => DbConnectionStringKey.GetValue("Server=localhost;Port=5432;Database=pigeonpulse-dev;User Id=pigeonpulse;Password=password1;");
}