namespace PigeonPulse.Api.Models.Request.Account;

public class RegisterUserRequestModel
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}