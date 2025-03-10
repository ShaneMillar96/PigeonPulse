using AutoMapper;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.Request.Pigeon;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Api.Models.View.Pagination;
using PigeonPulse.Api.Models.View.Pigeon;
using PigeonPulse.Services.Dtos.Pagination;
using PigeonPulse.Services.Dtos.Pigeon;

namespace PigeonPulse.Api.Profiles;

public class PigeonProfile : Profile
{
    public PigeonProfile()
    {
        ConfigureDtoToModel();
        ConfigureModelToDto();
        ConfigurePaginateMapping();
    }
    
    private void ConfigureDtoToModel()
    {
        CreateMap<PigeonDto, PigeonViewModel>();
    }

    private void ConfigureModelToDto()
    {
        CreateMap<CreatePigeonRequest, CreatePigeonDto>();
        CreateMap<UpdatePigeonRequest, UpdatePigeonDto>();

    }
    
    private void ConfigurePaginateMapping()
    {
        CreateMap<PaginatedDto<PigeonDto>, PaginatedViewModel<PigeonViewModel>>();
    }
}