using Microsoft.EntityFrameworkCore;
using PigeonPulse.Dal.Contexts;
using PigeonPulse.Dal.Models.application;
using PigeonPulse.Services.Interfaces;
using PigeonPulse.Services.Profiles;
using PigeonPulse.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddDbContext<PigeonPulseDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(config => config.AllowNullCollections = true, typeof(Program).Assembly,
    typeof(UserService).Assembly, typeof(PigeonService).Assembly);
// Register services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPigeonService, PigeonService>();
builder.Services.AddScoped<IRaceService, RaceService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAllOrigins"); 
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();