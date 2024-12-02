using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sales.Application.Queries;
using static Logger.Utility.Constants;
using System.Net;
using Sales.Application.Commands;

namespace Sales.Api.Controllers
{
    [Route("api/shipping")]
    [ApiController]
    public class ShippingController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ShippingController> _logger;
        public ShippingController(IMediator mediator, ILogger<ShippingController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// (Leader) Get all shipping orders paginated of a leader
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex           = 1    (default)
        ///     Pagesize            = 8    (default)
        ///     LeaderId            = required
        ///     SearchByPhone       = null (default)
        ///     Status              = 0    (default)
        ///     
        ///     Status = 0 (Tiếp nhận đơn)
        ///              1 (Gán Worker)
        ///              2 (Đang giao)
        ///              3 (Đã giao)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("1")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedShippingOrders([FromQuery] GetPagedShippingOrdersQuery query)
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
        /// (Leader) Assign a worker to orders list
        /// </summary>
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpPost("2")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedShippingOrders(AddShippingOrdersToWorkerCommand command)
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
        /// (Authentication) Get a shipping order detail
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     ShippingId = OrderId
        ///     
        /// </remarks>
        [Authorize]
        [HttpGet("3")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetShippingOrder([FromQuery] GetShippingOrderQuery query)
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
        /// (Worker) Get processing shipping orders of a worker
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     ShippingId == null (get all processing shipping orders of a worker)
        ///     ShippingId != null (get processing shipping order with ShippingId of a worker)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.WorkerRole)]
        [HttpGet("4")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetShippingOrdersOfWorker([FromQuery] GetShippingOrdersOfWorkerQuery query)
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
        /// (Worker) ASSIGNED shipping order change to DELIVERING shipping order
        /// </summary>
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("5")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ChangeToDeliveringStatus(ChangeToDeliveringStatusCommand command)
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
        /// (Worker) DELIVERING shipping order change to DELIVERIED shipping order
        /// </summary>
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("6")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ChangeToDeliveredStatus([FromForm] ChangeToDeliveredStatusCommand command)
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
        /// (Worker) DELIVERING shipping order change to DELAYED shipping order
        /// </summary>
        [Authorize(Roles = Role.WorkerRole)]
        [HttpPost("7")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ChangeToDelayedStatus([FromQuery] ChangeToDelayedStatusCommand command)
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
