using AutoMapper;
using PigeonPulse.Api.Models.Request.Race;
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
        CreateMap<RaceResultDto, RaceResultViewModel>();

    }

    private void ConfigureModelToDto()
    {
        CreateMap<CreateRaceRequest, CreateRaceDto>();
        CreateMap<CreateRaceResultRequest, CreateRaceResultDto>();
    }
}