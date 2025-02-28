using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PigeonPulse.Api.Controllers.Base;
using PigeonPulse.Api.Models.Request;
using PigeonPulse.Api.Models.View;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Services.Dtos.Pigeon;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PigeonController : PigeonPulseBaseController
    {
        private readonly IMapper _mapper;
        private readonly IPigeonService _pigeonService;

        public PigeonController(PigeonPulseDbContext context, IPigeonService pigeonService, IMapper mapper)
            : base(context)
        {
            _pigeonService = pigeonService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePigeon([FromBody] PigeonRequest request)
        {
            var currentUserId = GetCurrentUserId();
            
            var pigeon = await _pigeonService.CreatePigeonAsync(currentUserId, _mapper.Map<CreatePigeonDto>(request));
            return Ok(_mapper.Map<PigeonViewModel>(pigeon));
        }

        [HttpGet]
        public async Task<IActionResult> GetPigeonsByUserId()
        {
            var currentUserId = GetCurrentUserId();
            
            var pigeons = await _pigeonService.GetPigeonsByUserIdAsync(currentUserId);
            return Ok(_mapper.Map<List<PigeonViewModel>>(pigeons));
        }
    }
}