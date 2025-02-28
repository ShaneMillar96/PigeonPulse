using AutoMapper;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Account;
using PigeonPulse.Services.Dtos.User;

namespace PigeonPulse.Services.Profiles;

public class AccountProfile : Profile
{
    public AccountProfile()
    {
        ConfigureDomainToDto();
        ConfigureDtoToDomain();
    }
    
    private void ConfigureDomainToDto()
    {
        CreateMap<User, RegisterDto>();
        CreateMap<User, UserDto>();
    }

    private void ConfigureDtoToDomain()
    {
        CreateMap<RegisterDto, User>()
            .ForMember(d => d.PasswordHash, o => o.MapFrom(x => BCrypt.Net.BCrypt.HashPassword(x.Password)))
            .ForMember(d => d.CreatedDate,
                o => o.MapFrom(x => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Unspecified)));
    }
}