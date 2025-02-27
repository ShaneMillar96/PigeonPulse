using AutoMapper;
using PigeonPulse.Dal.Models.application;
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
        CreateMap<Race, RaceDto>();
    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<CreateRaceDto, Race>()
            .ForMember(d => d.Date, o => o.MapFrom(x => DateTime.SpecifyKind(x.Date, DateTimeKind.Unspecified))) // Convert UTC to Unspecified for timestamp without time zone
            .ForMember(d => d.CreatedDate, o => o.MapFrom(x => DateTime.Now));
    }
}