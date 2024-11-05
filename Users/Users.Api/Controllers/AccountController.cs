using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Net;
using Users.Application.Commands;
using Users.Application.Queries;
using Users.Application.Responses;
using Users.Domain.Entities;
using static Logger.Utility.Constants;

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
        /// Signin by Email/Password or Phone/Password
        /// </summary>
        /// 
        [HttpPost("1")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> SignIn([FromBody] SignInCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);
                
                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (ADMIN, MANAGER) Disable an user
        /// </summary>
        [Authorize(Roles = Role.AdminRole + "," + Role.ManagerRole)]
        [HttpPut("2")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> DisableAccount([FromBody] DisableAccountCommand command)
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
        /// (Authentication) Get an account 
        /// </summary>
        [Authorize]
        [HttpGet("3")]
        [ProducesResponseType(typeof(TResponse<Accounts>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetAccount()
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetAccountQuery(accountId);
                var result = await _mediator.Send(query);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);
                
                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (Authentication) Update an account
        /// </summary>
        [Authorize]
        [HttpPut("4")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdateAccount(
            [StringLength(20, MinimumLength = 2)][FromForm] string fullName,
            [EmailAddress][FromForm] string email,
            [FromForm] DateOnly dateOfBirth)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new UpdateAccountCommand(accountId, fullName, email, dateOfBirth);
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
        /// (Authentication) Update account's avatar
        /// </summary>
        [Authorize]
        [HttpPut("5")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> UpdatePhotoAccount(IFormFile photo)
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new UpdatePhotoAccountCommand(accountId, photo);
                var result = await _mediator.Send(command);
                if (result.Item1 is 400)
                    return BadRequest(result.Item2);
                else if (result.Item1 is 404)
                    return NotFound(result.Item2);

                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (ADMIN) Create a personnel's account
        /// </summary>
        [Authorize(Roles = Role.AdminRole)]
        [HttpPost("6")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> CreatePersonnel([FromBody] CreatePersonnelCommand command)
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
        /// Get all role
        /// </summary>
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
        /// Send password reset link via gmail
        /// </summary>        
        [HttpPost("8")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> CreatePasswordResetLink([FromBody] CreatePasswordResetLinkCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);

                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// Reset password
        /// </summary>        
        [HttpPost("9")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ResetPassword([FromBody] PasswordResetCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Item1 is 404)
                    return NotFound(result.Item2);

                return Ok(result.Item2);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error message: {ex.Message}\n\nError{ex.StackTrace}");
                return StatusCode(500, $"Error message: {ex.Message}\n\nError{ex.StackTrace}");
            }
        }

        /// <summary>
        /// (ADMIN) Get all accounts paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex       = 1    (default)
        ///     Pagesize        = 8    (default)
        ///     SearchByEmail   = null (default)
        ///     Role            = null (default)
        ///     IsDisabled      = null (default)
        ///   
        ///     Get all accounts paginated
        /// </remarks>
        [Authorize(Roles = Role.AdminRole)]
        [HttpGet("10")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
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
        /// Renew access token when access token expires
        /// </summary>
        [HttpPost("11")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> ResetToken([FromBody] ResetTokenCommand command)
        {
            try
            {
                var result = await _mediator.Send(command);
                if (result.Item1 is 401)
                    return Unauthorized(result.Item2);               

                return Ok(result.Item2);
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
        [Authorize]
        [HttpPost("12")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var command = new LogoutCommand(accountId);
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
        /// (MANAGER) Create a customer's account
        /// </summary>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPost("13")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.Created)]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerCommand command)
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
        /// (MANAGER) Get all leader paginated 
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex       = 1    (default)
        ///     Pagesize        = 8    (default)
        ///     SearchByEmail   = null (default) 
        ///     AreaId          = null (default)
        ///     IsDisabled      = null (default)
        ///   
        ///     Get all leader paginated
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("14")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedLeader([FromQuery] GetPagedLeaderQuery query)
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
        /// Pending approval to create a customer's account
        /// </summary>
        [HttpPost("15")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> PendingApprovalCreateCustomer([FromBody] PendingApprovalCreateCustomerCommand command)
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
        /// (MANAGER) Assign a worker to a leader
        /// </summary>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpPost("16")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> AssignWorkerToLeader([FromBody] AssignWorkerToLeaderCommand command)
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
        /// (Leader) Get all worker from a leader 
        /// </summary>
        ///
        [Authorize(Roles = Role.TeamLeaderRole)]
        [HttpGet("17")]
        [ProducesResponseType(typeof(object), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPagedLeader()
        {
            try
            {
                var accountId = (HttpContext.User.FindFirst("accountId")?.Value) ?? "";
                var query = new GetAllWorkersFromLeaderQuery(accountId);
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
        /// (MANAGER) Get all pending accounts paginated
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///     
        ///     PageIndex       = 1    (default)
        ///     Pagesize        = 8    (default)
        ///     SearchByPhone   = null (default) 
        ///   
        /// </remarks>
        [Authorize(Roles = Role.ManagerRole)]
        [HttpGet("18")]
        [ProducesResponseType(typeof(List<object>), (int)HttpStatusCode.OK)]
        public async Task<IActionResult> GetPendingAccounts([FromQuery] GetPagedPendingAccountsQuery query)
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
