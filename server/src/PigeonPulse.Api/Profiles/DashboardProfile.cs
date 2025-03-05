using AutoMapper;
using PigeonPulse.Api.Models.View.Dashboard;
using PigeonPulse.Services.Dtos.Dashboard;

namespace PigeonPulse.Api.Profiles;

public class DashboardProfile : Profile
{
    public DashboardProfile()
    {
        ConfigureDtoToModel();
        ConfigureModelToDto();
    }
    
    private void ConfigureDtoToModel()
    {
        CreateMap<DashboardDto, DashboardViewModel>();
        CreateMap<BestLongRangePigeonDto, BestLongRangePigeonViewModel>();
        CreateMap<MostActivePigeonDto, MostActivePigeonViewModel>();
        CreateMap<BestPigeonDto, BestPigeonViewModel>();
        CreateMap<BestRaceDto, BestRaceViewModel>();
        CreateMap<RaceSummaryDto, RaceSummaryViewModel>();
    }

    private void ConfigureModelToDto()
    {
    }
}