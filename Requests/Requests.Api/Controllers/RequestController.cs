using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Requests.Application.Commands;
using Requests.Application.Queries;
using Requests.Application.ViewModels;
using System.Net;
using static Logger.Utility.Constants;

namespace Requests.Api.Controllers
{
    [Route("api/request")]
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
        /// (Leader) Get all room of a customer
        /// </summary>
        /// 
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("1")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCustomerRooms(
            [FromQuery] string email_Or_Phone)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetCustomerRoomsQuery(accountId, email_Or_Phone);
                var result = await _mediator.Send(query);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);
                else if (result.Item1 is 409)
                    return Conflict(result.Item2);

                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Leader) Create a new request
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     categoryRequest   = 0 (Warranty Product)
        ///     categoryRequest   = 1 (Repair Request)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpPost("2")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> CreateNewRequest(
            [FromForm] string customerId,
            [FromForm] string roomId,
            [FromForm] string customerProblem,
            [FromForm] Request.CategoryRequest categoryRequest)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new CreateNewRequestCommand(accountId, customerId, roomId, customerProblem, categoryRequest);
                var result = await _mediator.Send(command);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);
                else if (result.Item1 is 409)
                    return Conflict(result.Item2);

                return Created("", result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Leader) Update a new request
        /// </summary>
        /// 
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpPut("3")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateNewRequest([FromBody] UpdateNewRequestCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);
                else if (result.Item1 is 409)
                    return Conflict(result.Item2);

                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Leader) Cancel a new request
        /// </summary>
        /// 
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpDelete("4")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CancelNewRequest([FromBody] CancelNewRequestCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);
                else if (result.Item1 is 409)
                    return Conflict(result.Item2);

                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Leader) Add workers to a request
        /// </summary>
        /// 
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpPost("5")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddWorkersToRequest([FromBody] AddWorkersToRequest request)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new AddWorkersToRequestCommand(accountId, request.RequestId, request.WorkerList);
                var result = await _mediator.Send(command);
                if (result.Item1 is 400)
                    return BadRequest(result.Item2);
                else if (result.Item1 is 404)
                    return NotFound(result.Item2);
                else if (result.Item1 is 409)
                    return Conflict(result.Item2);

                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Worker) Add products to a request
        /// </summary>
        /// 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("6")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddProductsToRequest([FromBody] AddProductsToRequest request)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new AddProductsToRequestCommand(accountId, request.RequestId, request.ProductList);
                var result = await _mediator.Send(command);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);
                else if (result.Item1 is 409)
                    return Conflict(result.Item2);

                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Leader) Get request list of a leader
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     status      = null (default)
        ///     startDate   = null (default)
        ///   
        ///     Get request list of a leader by filter
        /// </remarks>
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("7")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetRequests(
            [FromQuery] uint? status,
            [FromQuery] DateOnly? startDate)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetRequestsQuery(accountId, status, startDate);
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
        /// (Customer) Get request list of a customer
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     status      = null (default)
        ///     startDate   = null (default)
        ///   
        ///     Get request list of a customer by filter
        /// </remarks>
        [Authorize(Roles = Role.CustomerRole)]
        [HttpGet("8")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCustomerRequests(
            [FromQuery] uint? status,
            [FromQuery] DateOnly? startDate)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetCustomerRequestsQuery(accountId, status, startDate);
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
