using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Domain.Entities;

namespace Users.Domain.IRepositories
{
    public interface IUnitOfWork
    {
        IGenericRepository<Accounts> AccountRepo { get; }
        IGenericRepository<RefreshTokens> RefreshTokenRepo { get; }
    }
}
