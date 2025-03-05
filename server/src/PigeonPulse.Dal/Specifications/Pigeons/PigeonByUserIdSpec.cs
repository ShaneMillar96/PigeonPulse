using System.Linq.Expressions;
using PigeonPulse.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace PigeonPulse.Dal.Specifications.Pigeons;

public class PigeonByUserIdSpec : Specification<Pigeon>
{
    private readonly int _userId;

    public PigeonByUserIdSpec(int userId) => _userId = userId;

    public override Expression<Func<Pigeon, bool>> BuildExpression()
    {
        return x => x.UserId == _userId;
    }
}