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
        ///     status = 0 (Requested)
        ///     status = 1 (Proccessing)
        ///     status = 2 (Done)
        ///     status = 3 (Cancel)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("7")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetRequests(
            [FromQuery] Request.Status? status,
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
        ///     status = 0 (Requested)
        ///     status = 1 (Proccessing)
        ///     status = 2 (Done)
        ///     status = 3 (Cancel)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.CustomerRole)]
        [HttpGet("8")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCustomerRequests(
            [FromQuery] Request.Status? status,
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

        /// <summary>
        /// (Worker) Update a product to a request
        /// </summary>
        /// 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPut("9")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateProductToRequest([FromBody] UpdateProductToRequest request)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new UpdateProductToRequestCommand(accountId, request.Product);
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
        /// (Worker) Delete a product to a request
        /// </summary>
        /// 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpDelete("10")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteProductToRequest([FromBody] string requestDetailId)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new DeleteProductToRequestCommand(accountId, requestDetailId);
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
        /// (Worker) Add warranty cards to a request (If it is warranty request, you must use this api)
        /// </summary>
        /// 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("11")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddWarrantyCardsToRequest([FromBody] AddWarrantyCardsToRequest request)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new AddWarrantyCardsToRequestCommand(accountId, request.RequestId, request.WarrantyCardIdList);
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
        /// (Worker) Delete a warranty card to a request (If it is warranty request, you can use this api)
        /// </summary>
        /// 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpDelete("12")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteWarrantyCardToRequest(
            [FromForm] string requestId,
            [FromForm] string warrantyCardId)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new DeleteWarrantyCardToRequestCommand(accountId, requestId, warrantyCardId);
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
        /// (Worker) If this request is online payment, you must call this api
        /// </summary>
        /// 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("13")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CheckRequestOnlinePayment(
            [FromForm] string requestId,
            [FromForm] string conclusion)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new CheckRequestOnlinePaymentCommand(accountId, requestId, conclusion);
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
        /// (Worker) When you finish paying online or offline, call this api
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     When you finish paying online, you must call this api
        ///     When you finish paying offline, you must call this api
        ///     When this request has 0 vnd totalprice, call directly this api
        ///     
        /// </remarks>
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("14")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> SuccessRequestPayment([FromForm] SuccessRequestPaymentCommand command)
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
                _logger.LogError($"Error message: {ex.InnerException?.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }
        /// <summary>
        /// (Worker) Get request list of a Worker.
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     isWarranty = 0  (default)     
        ///           
        /// </remarks>
        [Authorize(Roles = Role.WorkerRole)]
        [HttpGet("15")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetWorkerRequests(
           [FromQuery] int? isWarranty)
        {
            try
            {
                var workerId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetWorkerRequestsQuery(workerId, Convert.ToBoolean(isWarranty));
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
        /// (Worker) Get the details of a (repair/warranty) request.
        /// </summary>     
        [Authorize(Roles = Role.WorkerRole)]
        [HttpGet("16")]
        [ProducesResponseType(typeof(WorkerRequestDetail), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetWorkerRequestDetails(
            [FromQuery] string? requestId)
        {
            try
            {
                var workerId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetWorkerRequestDetailsQuery(requestId, workerId);
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
