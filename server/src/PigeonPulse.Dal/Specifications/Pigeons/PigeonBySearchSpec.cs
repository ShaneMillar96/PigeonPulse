using System.Linq.Expressions;
using PigeonPulse.Dal.Models.application;
using Unosquare.EntityFramework.Specification.Common.Primitive;

namespace PigeonPulse.Dal.Specifications.Pigeons;

public class PigeonBySearchSpec : Specification<Pigeon>
{
    private readonly Specification<Pigeon> _spec;
    
    public PigeonBySearchSpec(string? search) =>_spec = new PigeonByRingSpec(search);
    
    public override Expression<Func<Pigeon, bool>> BuildExpression() =>
        _spec.BuildExpression();

}