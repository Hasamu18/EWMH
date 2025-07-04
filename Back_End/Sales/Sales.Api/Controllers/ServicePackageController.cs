﻿using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sales.Application.Commands;
using static Logger.Utility.Constants;
using System.Net;
using Sales.Application.Queries;
using Users.Application.Queries;

namespace Sales.Api.Controllers
{
    [Route("api/service-package")]
    [ApiController]
    public class ServicePackageController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ServicePackageController> _logger;
        public ServicePackageController(IMediator mediator, ILogger<ServicePackageController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// (Manager) Add a service package
        /// </summary>
        /// 
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPost("1")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddServicePackage([FromForm] AddServicePackageCommand command)
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
        /// (Manager) Update a service package
        /// </summary>
        /// 
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPut("2")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateServicePackage([FromForm] UpdateServicePackageCommand command)
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
        /// (Manager) Disable a service package
        /// </summary>
        /// 
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPut("3")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DisableServicePackage([FromForm] DisableServicePackageCommand command)
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
        /// (Authentication) Get a service package
        /// </summary>
        /// 
        [Authorize]
        [HttpGet("4")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetServicePackage([FromQuery] GetServicePackageQuery query)
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
        /// (Authentication) Get all service packages paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex           = 1    (default)
        ///     Pagesize            = 8    (default)
        ///     SearchByName        = null (default)
        ///     Status(IsDisabled)  = null (default)
        ///   
        ///     Get all service packages paginated
        /// </remarks>
        [Authorize]
        [HttpGet("5")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedServicePackage([FromQuery] GetPagedServicePackageQuery query)
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
        /// (Customer) Get draft contract 
        /// </summary>
        /// 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpGet("6")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetDraftContract([FromQuery] string servicePackageId)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetDraftContractQuery(accountId, servicePackageId);
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
        /// (Customer) Check whether this customer is eligible for online or offline payment 
        /// </summary>
        /// <remarks> 
        ///     
        ///     Online payment:  return payment link
        ///     Offline payment: return "payment later" notification 
        ///   
        /// </remarks>
        [Authorize(Roles = Role.CustomerRole)]
        [HttpPost("7")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CheckServicePackagePayment(
            [FromForm] string servicePackageId,
            [FromForm] bool isOnlinePayment)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new CheckServicePackagePaymentCommand(accountId, servicePackageId, isOnlinePayment);
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
        /// (Customer) When this customer successfully pays online for the service package, call this api
        /// </summary>
        /// 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpPost("8")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> SuccessSPOnlinePayment(
            [FromForm] string servicePackageId,
            [FromForm] long orderCode,
            [FromForm] string contractId)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new SuccessSPOnlinePaymentCommand(accountId, servicePackageId, orderCode, contractId);
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
        /// (Leader) Scan a contract
        /// </summary>
        /// 
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpPut("9")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ScanContract([FromForm] ScanContractCommand command)
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
        /// (Leader) Cancel the a pending contract when this contract is offline payment
        /// </summary>
        /// 
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpDelete("10")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CancelSPOfflinePayment([FromForm] CancelSPOfflinePaymentCommand command)
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

        [HttpGet("11")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPaymentInformationByPayOs([FromQuery] GetPaymentInformationByPayOsCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);               
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Authentication) Get contracts (not pending) and requests of a customer
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     StartDate = null (default)
        ///     EndDate   = null (default)
        ///     
        ///     Start and End date (yyyy-mm-dd)
        ///     
        /// </remarks>
        [Authorize]
        [HttpGet("12")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetContractsOfCustomer([FromQuery] GetContractsOfCustomerQuery query)
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
        /// (Leader) Get all pending contracts of a leader
        /// </summary>
        ///
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("13")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllPendingContracts(string? phone)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetAllPendingContractsQuery(accountId, phone);
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
        /// (Manager) Get all contracts paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex              = 1    (default)
        ///     Pagesize               = 8    (default)
        ///     SearchByPhone          = null (default)
        ///     PurchaseTime_Des_Sort  = true (default)
        ///   
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("14")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedContracts([FromQuery] GetPagedContractsQuery query)
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
        /// (Leader) Get all still valid contracts of a leader
        /// </summary>
        ///
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("15")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllStillValidContracts(string? phone)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetAllStillValidContractsQuery(accountId, phone);
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
        /// (Leader) Get all expired contracts of a leader
        /// </summary>
        ///
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("16")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllExpireContracts(string? phone)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetAllExpireContractsQuery(accountId, phone);
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
        /// (Customer) Get all pending contracts of a customer
        /// </summary>
        ///
        [Authorize(Roles = Role.CustomerRole)]
        [HttpGet("17")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllPendingContractsOfCustomer()
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetAllPendingContractsOfCustomerQuery(accountId);
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
        /// (Authentication) Get renevue and number of purchasing from (a service package or top service packages)
        /// </summary>
        [Authorize]
        [HttpGet("18")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetNumOfPurchaseAndRevenueOfSP([FromQuery] GetNumOfPurchaseAndRevenueOfSPQuery query)
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
        /// (Authentication) Get contract detail and requests from contractId
        /// </summary>
        /// 
        [Authorize]
        [HttpGet("19")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetContractAndRequests([FromQuery] GetContractAndRequestsQuery query)
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
