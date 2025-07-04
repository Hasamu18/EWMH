﻿using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sales.Application.Commands;
using static Logger.Utility.Constants;
using System.Net;
using Sales.Application.Queries;

namespace Sales.Api.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<OrderController> _logger;
        public OrderController(IMediator mediator, ILogger<OrderController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// (Customer) Add product to cart
        /// </summary>
        /// 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpPost("1")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddProductToCart(
            [FromForm] string productId,
            [FromForm] int quantity)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new AddProductToCartCommand(accountId, productId, quantity);
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
        /// (Customer) Get cart
        /// </summary>
        /// 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpGet("2")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetCartQuery(accountId);
                var result = await _mediator.Send(query);               
                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Customer) Delete a product to cart
        /// </summary>
        /// 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpDelete("3")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DeleteProductToCart([FromForm] string productId)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new DeleteProductToCartCommand(accountId, productId);
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
        /// (Customer) Get payment link for products in cart
        /// </summary>
        /// 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpPost("4")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CheckOrderPayment([FromForm] string? customerNote, [FromForm] string address)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new CheckOrderPaymentCommand(accountId, customerNote, address);
                var result = await _mediator.Send(command);                
                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Customer) When this customer successfully pays online for the order cart, call this api
        /// </summary>
        /// 
        [Authorize(Roles = Role.CustomerRole)]
        [HttpPost("5")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> SuccessOrderPayment([FromForm] SuccessOrderPaymentCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.InnerException?.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Authentication) Get orders and detail orders of a customer
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
        [HttpGet("6")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetOrdersOfCustomer([FromQuery] GetOrdersOfCustomerQuery query)
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
        /// (Manager) Get all orders paginated 
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
        [HttpGet("7")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedOrders([FromQuery] GetPagedOrdersQuery query)
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
        /// (Authentication) Get order detail from orderId 
        /// </summary>
        ///
        [Authorize]
        [HttpGet("8")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetOrderDetails([FromQuery] GetOrderDetailsQuery query)
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
        /// (Manager) Get all orders paginated in currently
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex           = 1    (default)
        ///     Pagesize            = 8    (default)
        ///     
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("9")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetCurrentOrders([FromQuery] GetCurrentOrdersQuery query)
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
