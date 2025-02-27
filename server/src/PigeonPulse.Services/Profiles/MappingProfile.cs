using AutoMapper;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Dtos.Pigeon;
using PigeonPulse.Services.Dtos.Race;
using PigeonPulse.Services.Dtos.User;

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