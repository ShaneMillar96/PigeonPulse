namespace PigeonPulse.Api.Models.View.Pagination;

public class PaginatedViewModel<T>
{
    public T[] Data { get; set; }
    
    public int TotalCount { get; set; }
}