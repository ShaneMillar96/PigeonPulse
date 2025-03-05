using PigeonPulse.Services.Dtos.Pagination;

namespace PigeonPulse.Services.Interfaces;

public interface IPaginationService
{
    Task<PaginatedDto<T>> CreatePaginatedResponseAsync<T>(IQueryable<T> query, int pageSize, int pageNumber);

}