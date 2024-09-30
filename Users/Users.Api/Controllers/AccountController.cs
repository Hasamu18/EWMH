using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Net;
using Users.Application.Commands;
using Users.Application.Queries;
using Users.Application.Responses;
using Users.Application.Utility;
using Users.Domain.Entities;

namespace Users.Api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<AccountController> _logger;
        public AccountController(IMediator mediator, ILogger<AccountController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        /// <summary>
        /// Signin by Email/Password or Google or PhoneNumber
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "uid": "TfSgaj8jscVFnJPhY8wGH6Xfkzw1"
        ///     }
        ///     
        /// </remarks>
        /// <response code="200">Return a message</response>
        [HttpPost("1")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> SignIn([FromBody] SignInCommand command)
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
        /// (ADMIN) Disable an user
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "uid": "TfSgaj8jscVFnJPhY8wGH6Xfkzw1",
        ///        "disable: true,
        ///        "statusInText": "vi phạm ngôn từ"
        ///     }
        /// </remarks>
        /// <response code="200">Return a message</response>
        [Authorize(Roles = Constants.Role.AdminRole)]
        [HttpPut("2")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DisableAccount([FromBody] DisableAccountCommand command)
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
        /// (Authorize) Get an user
        /// </summary>
        /// <response code="200">Return a message</response>
        [Authorize]
        [HttpGet("3")]
        [ProducesResponseType(typeof(TResponse<Account>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAccount()
        {
            try
            {
                var uid = (HttpContext.User.FindFirst("uid")?.Value) ?? "";
                var query = new GetAccountQuery(uid);
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
        /// (Authorize) Update an user
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "displayName": "abcxyz"
        ///     }
        ///     
        /// </remarks>
        /// <response code="200">Return a message</response>
        [Authorize]
        [HttpPut("4")]
        [ProducesResponseType(typeof(TResponse<Account>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateAccount(
            [StringLength(20, MinimumLength = 6)]
            [FromBody] string displayName)
        {
            try
            {
                var uid = (HttpContext.User.FindFirst("uid")?.Value) ?? "";
                var command = new UpdateAccountCommand(uid, displayName);
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
        /// (Authorize) Update user's photo
        /// </summary>
        /// <remarks>
        ///
        ///   Warning: The image must be .jpg, .jpeg, .png
        /// 
        /// </remarks>
        /// <response code="200">Return a message</response>
        [Authorize]
        [HttpPut("5")]
        [ProducesResponseType(typeof(TResponse<Account>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdatePhotoAccount(IFormFile photo)
        {
            try
            {
                var uid = (HttpContext.User.FindFirst("uid")?.Value) ?? "";
                var command = new UpdatePhotoAccountCommand(uid, photo);
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
        /// (ADMIN) Create personnel's account
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "email": "abc@gmail.com",
        ///        "phoneNumber: "+84765689761",
        ///        "role": "MANAGER"
        ///     }
        ///   
        /// </remarks>
        /// <response code="200">Return a message</response>
        [Authorize(Roles = Constants.Role.AdminRole)]
        [HttpPost("6")]
        [ProducesResponseType(typeof(TResponse<Account>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CreatePersonnel([FromBody] CreatePersonnelCommand command)
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
        /// (Authorize) Get all role
        /// </summary>
        /// <response code="200">Return a message</response>
        [Authorize]
        [HttpGet("7")]
        [ProducesResponseType(typeof(List<string?>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAllRole()
        {
            try
            {
                var query = new GetAllRoleQuery();
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
        /// Send password reset link via email
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "email": "abc@gmail.com"
        ///     }
        ///   
        /// </remarks>
        /// <response code="200">Return a message</response>
        [HttpPost("8")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CreatePasswordResetLink([FromBody] CreatePasswordResetLinkCommand command)
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
        /// (ADMIN) Get all accounts paginated by SearchValue Email or DisplayName
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex   = 1    (default)
        ///     Pagesize    = 5    (default)
        ///     
        ///     SearchValue == null (default) get all accounts paginated 
        ///     SearchValue != null search by Email or DisplayName
        ///     
        ///     SortField   = Role (default) recommended
        ///     IsAsc       = true (default) for SortField
        ///   
        /// </remarks>
        /// <response code="200">Return a message</response>
        [Authorize(Roles = Constants.Role.AdminRole)]
        [HttpGet("9")]
        [ProducesResponseType(typeof(List<Account>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedAccount([FromQuery] GetPagedAccountQuery query)
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
        /// Reset token when access token expires
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     {
        ///        "AT": "ufsdg9s8g98srgg98srtssrtstertettwetr",
        ///        "RT": "696e5ce647464d8298100a790036e880"
        ///     }
        ///   
        /// </remarks>
        /// <response code="200">Return a message</response>
        [HttpPost("10")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ResetToken([FromBody] ResetTokenCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Equals("Unexisted refresh token"))
                    return Unauthorized(result);
                else if (result.Equals("You have been logged out of the system, you need to log in again"))
                    return Unauthorized(result);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// Logout an user
        /// </summary>
        /// <remarks>
        /// 
        /// Warning: when user calls logout api, client side must delete cookie containing AT, RT
        ///   
        /// </remarks>
        /// <response code="200">Return a message</response>
        [Authorize]
        [HttpPost("11")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var uid = (HttpContext.User.FindFirst("uid")?.Value) ?? "";
                var command = new LogoutCommand(uid);
                var result = await _mediator.Send(command);
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
