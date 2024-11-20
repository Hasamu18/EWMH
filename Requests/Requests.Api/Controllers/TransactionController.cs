using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Requests.Application.Queries;
using static Logger.Utility.Constants;
using System.Net;

namespace Requests.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<TransactionController> _logger;
        public TransactionController(IMediator mediator, ILogger<TransactionController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// (Manager) Get statistics transaction
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     StartYear    = 2021    (default)
        ///     EndYear      = 2024    (default)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("1")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetStatistics([FromQuery] GetStatisticsQuery query)
        {
            try
            {
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Authentication) Get paged transaction of a customer
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex           = 1    (default)
        ///     Pagesize            = 8    (default)
        ///     ServiceType         = 0    (default)
        ///     StartDate           = null (default)
        ///     EndDate             = null (default)
        ///     
        ///     ServiceType = 0 (Orders)
        ///                 = 1 (Contracts)
        ///                 = 2 (Requests)
        ///     
        /// </remarks>
        [Authorize]
        [HttpGet("2")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedTransactionOfCustomer([FromQuery] GetPagedTransactionOfCustomerQuery query)
        {
            try
            {
                var result = await _mediator.Send(query);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }
    }
}
