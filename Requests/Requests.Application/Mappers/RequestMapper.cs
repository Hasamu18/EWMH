using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Requests.Application.Mappers
{
    public static class RequestMapper
    {
        private static readonly Lazy<IMapper> Lazy = new(() =>
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.ShouldMapProperty = p => p.GetMethod!.IsPublic || p.GetMethod.IsAssembly;
                cfg.AddProfile<MapperProfile>();
            });
            var mapper = config.CreateMapper();
            return mapper;
        });

        public static IMapper Mapper => Lazy.Value;
    }
}
