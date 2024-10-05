using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using Users.Application.Commands;
using Users.Application.Utility;
using Users.Domain.Entities;

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
        [Authorize(Roles = Constants.Role.ManagerRole)]
        [HttpPost("1")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddApartment([FromForm] AddApartmentCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Item1 is 400)
                    return BadRequest(result.Item2);
                else if (result.Item1 is 404)
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
        /// (Manager) Update an apartment
        /// </summary>
        [Authorize(Roles = Constants.Role.ManagerRole)]
        [HttpPut("2")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateApartment([FromForm] UpdateApartmentCommand command)
        {
            try
            {
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
        /// (Manager) Add rooms
        /// </summary>
        [Authorize(Roles = Constants.Role.ManagerRole)]
        [HttpPost("3")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> AddRooms([FromBody] AddRoomsCommand command)
        {
            try
            {
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
        /// (Manager) Update a room
        /// </summary>
        [Authorize(Roles = Constants.Role.ManagerRole)]
        [HttpPut("4")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateRoom([FromBody] UpdateRoomCommand command)
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
    }
}
