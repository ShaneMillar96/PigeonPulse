using AutoMapper;
using Microsoft.AspNetCore.Identity.Data;
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
    }
}