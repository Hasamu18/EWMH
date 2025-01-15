using MediatR;
using Microsoft.Extensions.Configuration;
using Requests.Application.Commands;
using Requests.Domain.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Logger.Utility.Constants;

namespace Requests.Application.Handlers
{
    internal class AddPreRepairEvidenceToRequestHandler : IRequestHandler<AddPreRepairEvidenceToRequestCommand, (int, string)>
    {
        private readonly IUnitOfWork _uow;
        private readonly IConfiguration _config;
        public AddPreRepairEvidenceToRequestHandler(IUnitOfWork uow, IConfiguration config)
        {
            _uow = uow;
            _config = config;
        }

        public async Task<(int, string)> Handle(AddPreRepairEvidenceToRequestCommand request, CancellationToken cancellationToken)
        {
            var getRequest = await _uow.RequestRepo.GetByIdAsync(request.RequestId);
            if (getRequest == null)
                return (404, "Yêu cầu không tồn tại");

            //if (getRequest.Status != (int)Request.Status.Processing)
            //    return (409, "Chỉ có yêu cầu khi ở trạng thái \"đang xử lý\" mới có thể sử dụng chức năng này");

            int underscoreIndex = request.RequestId.IndexOf('_');
            string preId = request.RequestId.Insert(underscoreIndex, "PRE");
            var bucketAndPath = await _uow.RequestDetailRepo.UploadFileToStorageAsync(preId, request.File, _config);
            getRequest.PreRepairEvidenceUrl = $"https://firebasestorage.googleapis.com/v0/b/{bucketAndPath.Item1}/o/{Uri.EscapeDataString(bucketAndPath.Item2)}?alt=media";
            await _uow.RequestRepo.UpdateAsync(getRequest);
            return (200, "Đã thêm thành công");
        }
    }
}
