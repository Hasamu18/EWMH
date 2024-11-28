using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Sales.Application.Commands;
using Sales.Application.Queries;
using System.Net;
using static Logger.Utility.Constants;

namespace Sales.Api.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ProductController> _logger;
        public ProductController(IMediator mediator, ILogger<ProductController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// (Manager) Add a product
        /// </summary>
        /// 
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPost("1")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddProduct([FromForm] AddProductCommand command)
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
        /// (Manager) Update a product
        /// </summary>
        /// 
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPut("2")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateProduct([FromForm] UpdateProductCommand command)
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
        /// (Manager) Disable a product
        /// </summary>
        /// 
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPut("3")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DisableProduct([FromForm] DisableProductCommand command)
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
        /// (Authentication) Get a product
        /// </summary>
        /// 
        [Authorize]
        [HttpGet("4")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetProduct([FromQuery] GetProductQuery query)
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
        /// (Authentication) Get all products paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex            = 1    (default)
        ///     Pagesize             = 8    (default)
        ///     SearchByName         = null (default)
        ///     IncreasingPrice      = false (default)
        ///     Status(IsDisabled)   = null (default)
        ///   
        ///     Get all products paginated
        /// </remarks>
        [Authorize]
        [HttpGet("5")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedProduct([FromQuery] GetPagedProductQuery query)
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
        /// (Authentication) Get renevue and number of purchasing from (a product or top products)
        /// </summary>
        [Authorize]
        [HttpGet("6")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetNumOfPurchaseAndRevenueOfProducts([FromQuery] GetNumOfPurchaseAndRevenueOfProductsQuery query)
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
