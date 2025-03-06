// BaseContext.cs
using Microsoft.EntityFrameworkCore;

namespace PigeonPulse.Dal.Contexts;

public abstract class BaseContext : DbContext
{
    private readonly string? _connectionString;

    protected BaseContext() : base()
    {
    }

    protected BaseContext(DbContextOptions option) : base(option)
    {
    }
    
    protected BaseContext(string? connectionString)
    {
        _connectionString = connectionString;
    }
    
    public IQueryable<T> Get<T>() where T : class
    {
        return Set<T>().AsQueryable();
    }

    public new T Add<T>(T item) where T : class
    {
        return Set<T>().Add(item).Entity;
    }

    public void Add<T>(params T[] items) where T : class
    {
        Set<T>().AddRange(items);
    }

    public async Task<T> AddAsync<T>(T item) where T : class
    {
        return (await Set<T>().AddAsync(item)).Entity;
    }

    public void Delete<T>(params T[] items) where T : class
    {
        Set<T>().RemoveRange(items);
    }

    public bool ExecuteWithinTransaction(Action action)
    {
        using var transaction = Database.BeginTransaction();
        try
        {
            action();
            transaction.Commit();
            return true;
        }
        catch (Exception)
        {
            transaction.Rollback();
            throw;
        }
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!string.IsNullOrWhiteSpace(_connectionString) && !optionsBuilder.IsConfigured)
            optionsBuilder.UseNpgsql(_connectionString);
    }
}