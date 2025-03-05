using AutoMapper;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.Request.Account;
using PigeonPulse.Services.Dtos.Account;

namespace PigeonPulse.Api.Profiles;

public class AccountProfile : Profile
{
    public AccountProfile()
    {
        ConfigureDtoToModel();
        ConfigureModelToDto();
    }
    
    private void ConfigureDtoToModel()
    {
    }

    private void ConfigureModelToDto()
    {
        CreateMap<RegisterUserRequestModel, RegisterDto>();
        CreateMap<LoginUserRequestModel, LoginDto>();

    }
}