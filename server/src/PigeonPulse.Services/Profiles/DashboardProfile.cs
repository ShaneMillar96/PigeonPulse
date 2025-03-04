using AutoMapper;
using PigeonPulse.Services.Dtos.Dashboard;
using PigeonPulse.Dal.Models.application;

namespace PigeonPulse.Services.Profiles;

public class DashboardProfile : Profile
{
    public DashboardProfile()
    {
        ConfigureDomainToDto();
    }

    private void ConfigureDomainToDto()
    {
        // Mapping Best Pigeon
        CreateMap<RaceResult, BestPigeonDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Pigeon.Name))
            .ForMember(dest => dest.RingNumber, opt => opt.MapFrom(src => src.Pigeon.RingNumber))
            .ForMember(dest => dest.FastestTime, opt => opt.MapFrom(src => src.FinishTime.ToString(@"hh\:mm\:ss")));

        // Mapping Best Race
        CreateMap<Race, BestRaceDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.TimeGap, opt => opt.MapFrom(src =>
                src.RaceResults.Any()
                    ? (src.RaceResults.Max(rr => rr.FinishTime) - src.RaceResults.Min(rr => rr.FinishTime)).ToString(
                        @"hh\:mm\:ss")
                    : "00:00:00"));
    }
}