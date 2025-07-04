﻿using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
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
        /// (Leader, Customer) Get all room of a customer
        /// </summary>
        /// 
        [Authorize(Roles = Role.TeamLeaderRole + "," + Role.CustomerRole)]
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
                return StatusCode(result.Item1, result.Item2);
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
                return StatusCode(result.Item1, result.Item2);
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
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Leader, Worker) Cancel a new or processing request
        /// </summary>
        /// 
        [Authorize(Roles = Role.TeamLeaderRole + "," + Role.WorkerRole)]
        [HttpDelete("4")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CancelRequest([FromBody] CancelRequestCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return StatusCode(result.Item1, result.Item2);
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
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Worker) Add products to a repair request 
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
                return StatusCode(result.Item1, result.Item2);
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
        /// (Worker) Update a product to a repair request
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
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Worker) Delete a product to a repair request
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
                return StatusCode(result.Item1, result.Item2);
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
                return StatusCode(result.Item1, result.Item2);
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
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Worker) Only repair request, If this request is online payment, you must call this api
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
                return StatusCode(result.Item1, result.Item2);
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
        ///     - Repair Request
        ///     When you finish paying online, you must call this api (OrderCode get from deeplink)
        ///     When you finish paying offline, you must call this api (OrderCode = null)
        ///     When this request has 0 vnd totalprice, call directly this api (OrderCode = null)
        ///     - Warranty Request
        ///     Call directly this api (OrderCode = null)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("14")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> SuccessRequestPayment([FromBody] SuccessRequestPaymentCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return StatusCode(result.Item1, result.Item2);
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
        ///     requestType = 1  (RepairRequest - default)     
        ///           
        /// </remarks>
        [Authorize(Roles = Role.WorkerRole)]
        [HttpGet("15")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetWorkerRequests(
           [FromQuery] int requestType)
        {
            try
            {
                var workerId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetWorkerRequestsQuery(workerId, requestType);
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

        /// <summary>
        /// (Leader) Get Free/Busy worker list from a leader
        /// </summary>
        ///
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("17")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetFreeWorkersFromLeader([FromQuery] bool isFree)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetFreeWorkersFromLeaderQuery(accountId, isFree);
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
        /// (MANAGER) Get all requests paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex       = 1    (default)
        ///     Pagesize        = 8    (default)
        ///     Status          = null (default)
        ///     
        ///     0 = Requested
        ///     1 = Processing
        ///     2 = Done
        ///     3 = Canceled
        ///   
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("18")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedRequests([FromQuery] GetPagedRequestsQuery query)
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
        /// (Authentication) Get the details of a (warranty/repair) request
        /// </summary>     
        [Authorize]
        [HttpGet("19")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetRequestDetail([FromQuery] GetRequestDetailQuery query)
        {
            try
            {
                var result = await _mediator.Send(query);
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (CUSTOMER) Get details of the Leader being responsible for the Customer's apartment.
        /// </summary> 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpGet("20")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetLeaderDetailsByCustomerId()
        {
            try
            {
                var customerId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetLeaderDetailsQuery(customerId);
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
        /// (WORKER) Gets a list of Warranty Cards owned by a Customer. Use this API before 
        /// a Worker adds a Warranty Card to the Warranty Repair Request.
        /// </summary> 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpGet("21")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetWarrantyCardsByCustomerId(
            [FromQuery] string requestId,
            [FromQuery] string customerId,
            [FromQuery] string? productName,
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize)
        {
            try
            {
                var query = new GetWarrantyCardsQuery(requestId, customerId, productName, pageIndex, pageSize);
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
        /// (WORKER) Gets the details of a Warranty Card. Use this API before 
        /// a Worker chooses one of them from the Warranty Card list.
        /// </summary> 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpGet("22")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetWarrantyCardDetails([FromQuery] string warrantyCardId)
        {
            try
            {
                var query = new GetWarrantyCardDetailsQuery(warrantyCardId);
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
        /// (Customer) Get desired number of requests
        /// </summary>     
        [Authorize(Roles = Role.CustomerRole)]
        [HttpGet("23")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDesiredNumOfRequests([FromQuery] uint quantity)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetDesiredNumOfRequestsQuery(accountId, quantity);
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
        /// (Manager) Get all request's attatched orders paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex           = 1    (default)
        ///     Pagesize            = 8    (default)
        ///     SearchByPhone       = null (default)
        ///     DescreasingDateSort = true (default)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("24")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedAttachedOrders([FromQuery] GetPagedAttachedOrdersQuery query)
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
        /// (MANAGER) Get details of a request (repair/warranty)
        /// </summary>      
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("25")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetRequestDetails([FromQuery] GetManagerRequestDetailsQuery query)
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
        /// (Manager) Update price of request
        /// </summary>
        /// 
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPut("26")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateRequestPrice([FromBody] UpdateRequestPriceCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (MANAGER) Get all requests paginated in currently
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex       = 1    (default)
        ///     Pagesize        = 8    (default)
        ///   
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("27")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCurrentRequests([FromQuery] GetCurrentRequestsQuery query)
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
        /// (Manager) Get current price of request
        /// </summary>
        /// 
        //[Authorize(Roles = Role.ManagerRole)]
        [HttpGet("28")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCurrentRequestPrice()
        {
            try
            {
                var query = new GetCurrentRequestPriceQuery();
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
        /// (Customer) Create a new request
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     categoryRequest   = 0 (Warranty Product)
        ///     categoryRequest   = 1 (Repair Request)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.CustomerRole)]
        [HttpPost("29")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> CreateNewRequestForCus(
            [FromForm] string customerId,
            [FromForm] string roomId,
            [FromForm] string customerProblem,
            [FromForm] Request.CategoryRequest categoryRequest)
        {
            try
            {
                var command = new CreateNewRequestForCusCommand(customerId, roomId, customerProblem, categoryRequest);
                var result = await _mediator.Send(command);
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Worker) Add pre-repair evidence file
        /// </summary>
        /// 
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("30")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddPreRepairEvidenceToRequest([FromForm] AddPreRepairEvidenceToRequestCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Worker) Add post-repair evidence file
        /// </summary>
        /// 
        //[Authorize(Roles = Role.WorkerRole)]
        [HttpPost("31")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AddPostRepairEvidenceToRequest([FromForm] AddPostRepairEvidenceToRequestCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return StatusCode(result.Item1, result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }
    }
}

