using PigeonPulse.Services.Dtos.Dashboard;

namespace PigeonPulse.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardData(int userId);
}