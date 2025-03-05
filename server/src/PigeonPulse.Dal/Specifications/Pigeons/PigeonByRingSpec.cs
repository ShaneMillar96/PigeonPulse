using System.Linq.Expressions;
using PigeonPulse.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace PigeonPulse.Dal.Specifications.Pigeons;

public class PigeonByRingSpec : Specification<Pigeon>
{
    private readonly string? _ringNumber;

    public PigeonByRingSpec(string? ringNumber) => _ringNumber = ringNumber?.ToLower();
    
    public override Expression<Func<Pigeon, bool>> BuildExpression()
    {
        if (string.IsNullOrEmpty(_ringNumber)) return ShowAll;
        
        return x => x.RingNumber.ToLower().Contains(_ringNumber);
    }

}