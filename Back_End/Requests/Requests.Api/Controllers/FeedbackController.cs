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
    [Route("api/feedback")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<FeedbackController> _logger;
        public FeedbackController(IMediator mediator, ILogger<FeedbackController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }
        /// <summary>
        /// (Manager/Customer) Get the list of customer feedback in the system.
        /// </summary>
        /// <remarks>
        /// Sample query parameters:
        ///     
        ///     pageIndex        =   1 (must be at least 1)
        ///     pageSize         =   6 (Repair Request)
        ///     sortByStarOrder  =   asc (asc/desc, must be input as string)
        ///     status           =   1 (0/1/2, where 0 equals inactive, 1 equals active, 2 equals all)
        ///     
        /// </remarks>
        [Authorize(Roles = $"{Role.ManagerRole},{Role.CustomerRole}")]
        [HttpGet("1")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCustomerFeedbackList(
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize,
            [FromQuery] string? sortByStarOrder,
            [FromQuery] int status)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetCustomerFeedbackListQuery(accountId,pageIndex, pageSize,sortByStarOrder,status);
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
        /// (Manager/Customer) Get the details of a customer feedback in the system.
        /// </summary>
        /// 
        [Authorize(Roles = $"{Role.ManagerRole},{Role.CustomerRole}")]
        [HttpGet("2")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCustomerFeedback(
            [FromQuery] string feedbackId)
        {
            try
            {                
                var query = new GetCustomerFeedbackQuery(feedbackId);
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
        /// (Customer) Allows a Customer to give a feedback to a repair request.
        /// </summary>
        /// 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpPost("3")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CreateNewCustomerFeedback(
            [FromBody] CreateNewCustomerFeedbackRequest request)
        {
            try
            {
                var customerId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new CreateNewCustomerFeedbackCommand(request, customerId);
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
        /// (Manager) Allows the Manager to approve a customer's feedback.
        /// </summary>
        /// 
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPost("4")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ApproveCustomerFeedback(
            [FromBody] ApproveCustomerFeedbackRequest request)
        {
            try
            {                
                var query = new ApproveFeedbackCommand(request.FeedbackId);
                var result = await _mediator.Send(query);
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
