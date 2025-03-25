using AutoMapper;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Pigeon;

namespace PigeonPulse.Services.Profiles;

public class PigeonProfile : Profile
{
    public PigeonProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }
    
    private void ConfigureDomainToDto()
    {
        CreateMap<Pigeon, PigeonDto>();
    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<CreatePigeonDto, Pigeon>()
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));

        CreateMap<UpdatePigeonDto, Pigeon>();
        
        CreateMap<CreatePairedPigeonDto, Pigeon>()
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
    }
}