using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Requests.Application.Queries;
using System.Net;

namespace Requests.Api.Controllers
{
    [Route("api/requests")]
    [ApiController]
    public class RequestController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<RequestController> _logger;
        public RequestController(IMediator mediator, ILogger<RequestController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// (Authentication) Get all room of a customer
        /// </summary>
        /// 
        [Authorize]
        [HttpGet("1")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCustomerRooms([FromQuery] GetCustomerRoomsCommand query)
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
