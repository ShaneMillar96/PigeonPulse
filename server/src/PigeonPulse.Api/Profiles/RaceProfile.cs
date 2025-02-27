using AutoMapper;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Services.Dtos.Race;

namespace PigeonPulse.Api.Profiles;

public class RaceProfile : Profile
{
    public RaceProfile()
    {
        ConfigureDtoToModel();
        ConfigureModelToDto();
    }

    private void ConfigureDtoToModel()
    {
        CreateMap<RaceDto, RaceViewModel>();
    }

    private void ConfigureModelToDto()
    {
        CreateMap<RaceRequest, CreateRaceDto>();
    }
}