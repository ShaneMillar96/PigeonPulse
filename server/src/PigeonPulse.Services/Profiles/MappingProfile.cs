using AutoMapper;
using PigeonPulse.Services.Dtos;
using PigeonPulse.Dal.Models.application;

namespace PigeonPulse.Services.Profiles;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<Pigeon, PigeonDto>();
        CreateMap<Race, RaceDto>();
        CreateMap<Raceresult, RaceResultDto>();
    }
}