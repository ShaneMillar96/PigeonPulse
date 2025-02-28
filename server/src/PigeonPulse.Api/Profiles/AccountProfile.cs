using AutoMapper;
using PigeonPulse.Api.Models.Request;
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
        CreateMap<RegisterRequest, RegisterDto>();
        CreateMap<LoginRequest, LoginDto>();

    }
}