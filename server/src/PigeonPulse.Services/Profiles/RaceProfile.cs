using AutoMapper;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Leaderboard;
using PigeonPulse.Services.Dtos.Race;

namespace PigeonPulse.Services.Profiles;

public class RaceProfile : Profile
{
    public RaceProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }

    private void ConfigureDomainToDto()
    {
        CreateMap<Race, LeaderboardDto>() 
            .ForMember(d => d.RaceName, opt => opt.MapFrom(x => x.Name))
            .ForMember(d => d.Results, opt => opt.MapFrom(x => x.RaceResults));
        
        CreateMap<Race, RaceDto>();
        
        CreateMap<RaceResult, RaceResultDto>()
            .ForMember(d => d.TimeRecorded, o => o.MapFrom(x => x.FinishTime.ToTimeSpan())); 
        
        CreateMap<RaceStatus, RaceStatusDto>();
        
        CreateMap<Basket, BasketDto>()
            .ForMember(d => d.PigeonName, o => o.MapFrom(x => x.Pigeon.Name))
            .ForMember(d => d.RingNumber, o => o.MapFrom(x => x.Pigeon.RingNumber));
    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateRaceDto, Race>()
            .ForMember(d => d.Date, o => o.MapFrom(x => DateTime.SpecifyKind(x.Date, DateTimeKind.Unspecified))) // Convert UTC to Unspecified for timestamp without time zone
            .ForMember(d => d.CreatedDate, o => o.MapFrom(x => DateTime.Now));

        CreateMap<BasketPigeonDto, Basket>();
        
        CreateMap<CreateRaceResultDto, RaceResult>()
            .ForMember(d => d.FinishTime, o => o.MapFrom(x => TimeOnly.FromTimeSpan(x.TimeRecorded)));

    }
}