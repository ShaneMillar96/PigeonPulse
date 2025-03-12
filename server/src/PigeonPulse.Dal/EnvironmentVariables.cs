using PigeonPulse.Dal.Extensions;

namespace PigeonPulse.Dal;

public static class EnvironmentVariables
{
    private static string DbConnectionStringKey => "DbConnectionString";

    public static string? DbConnectionString
    {
        get
        {
            // Check if running on AWS (EC2 instance)
            bool isRunningOnEC2 = Environment.GetEnvironmentVariable("AWS_EXECUTION_ENV") != null;

            if (isRunningOnEC2)
            {
                // Use Amazon RDS connection
                return DbConnectionStringKey.GetValue("Host=pigeonpulse-dev.cbiqqummoi67.eu-north-1.rds.amazonaws.com;Port=5432;Database=pigeonpulse-dev;Username=pigeonpulse;Password=pigeonpulse96;");
            }
            else
            {
                // Use Localhost connection for development
                return DbConnectionStringKey.GetValue("Server=localhost;Port=5432;Database=pigeonpulse-dev;User Id=pigeonpulse;Password=password1;");
            }
        }
    }
}