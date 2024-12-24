using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Users.Application.Commands;
using Logger.Utility;
using Users.Domain.Entities;
using static Logger.Utility.Constants;
using Users.Application.Queries;

namespace Users.Api.Controllers
{
    [Route("api/apartment")]
    [ApiController]
    public class ApartmentController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ApartmentController> _logger;
        public ApartmentController(IMediator mediator, ILogger<ApartmentController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// (Manager) Add an apartment
        /// </summary>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPost("1")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddApartment([FromForm] AddApartmentCommand command)
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
        /// (Manager) Update an apartment
        /// </summary>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPut("2")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateApartment([FromForm] UpdateApartmentCommand command)
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
        /// (Manager) Add rooms
        /// </summary>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPost("3")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddRooms([FromBody] AddRoomsCommand command)
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
        /// (Manager) Update a room
        /// </summary>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPut("4")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateRoom([FromBody] UpdateRoomCommand command)
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
        /// Get all apartment paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex       = 1    (default)
        ///     Pagesize        = 8    (default)
        ///     SearchByName    = null (default) 
        ///   
        ///     Get all apartment paginated
        /// </remarks>
        [HttpGet("5")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedApartment([FromQuery] GetPagedApartmentQuery query)
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
        /// (MANAGER) Get all rooms paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     AreaId          = abcxyz
        ///     PageIndex       = 1    (default)
        ///     Pagesize        = 8    (default) 
        ///   
        ///     Get all rooms paginated
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("6")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedRooms([FromQuery] GetPagedRoomsQuery query)
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
        /// (Authentication) Get apartment history 
        /// </summary>
        [Authorize]
        [HttpGet("7")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetApartmentHistory([FromQuery] GetApartmentHistoryQuery query)
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
