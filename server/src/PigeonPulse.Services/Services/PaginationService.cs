using PigeonPulse.Services.Dtos.Pagination;
using PigeonPulse.Services.Extensions;
using PigeonPulse.Services.Interfaces;

namespace PigeonPulse.Services.Services;

public class PaginationService : IPaginationService
{
    public async Task<PaginatedDto<T>> CreatePaginatedResponseAsync<T>(IQueryable<T> query, int pageSize, int pageNumber)
    {
        var (items, totalCount) = await query.PaginateAsync(pageSize, pageNumber);
        return new PaginatedDto<T>
        {
            Data = items.ToArray(),
            TotalCount = totalCount
        };
    }
}