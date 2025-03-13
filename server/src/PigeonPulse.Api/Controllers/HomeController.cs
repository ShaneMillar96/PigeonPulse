using Microsoft.AspNetCore.Mvc;

[Route("/")]
[ApiController]
public class HomeController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { Message = "Welcome to PigeonPulse API v1.0.0" });
    }
}