using AutoMapper;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.Request.Pigeon;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Services.Dtos.Pigeon;

namespace PigeonPulse.Api.Profiles;

public class PigeonProfile : Profile
{
    public PigeonProfile()
    {
        ConfigureDtoToModel();
        ConfigureModelToDto();
    }
    
    private void ConfigureDtoToModel()
    {
        CreateMap<PigeonDto, PigeonViewModel>();
    }

    private void ConfigureModelToDto()
    {
        CreateMap<CreatePigeonRequest, CreatePigeonDto>();
    }
}