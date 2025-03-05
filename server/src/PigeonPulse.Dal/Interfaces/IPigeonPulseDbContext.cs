namespace PigeonPulse.Dal.Interfaces;

public interface IPigeonPulseDbContext
{
    IQueryable<T> Get<T>() where T : class;
    T Add<T>(T item) where T : class;
    void Add<T>(params T[] items) where T : class;
    Task<T> AddAsync<T>(T item) where T : class;
    void Delete<T>(params T[] items) where T : class;
    int SaveChanges();
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    bool ExecuteWithinTransaction(Action action);
    int GetCurrentUserId();
}