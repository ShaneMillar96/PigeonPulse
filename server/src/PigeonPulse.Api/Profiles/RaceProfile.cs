using AutoMapper;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Dal.Models.application;
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
        CreateMap<RaceRequest, CreateRaceDto>();
        CreateMap<RaceResultRequest, CreateRaceResultDto>();
        CreateMap<BasketRequest, BasketPigeonDto>();

    }
}