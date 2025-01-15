export const PRE_REPAIR_BULLET_POINTS: string[] = [
  `\u25CF Đảm bảo minh bạch trong quá trình làm việc.`,
  `\u25CF Làm bằng chứng đối chiếu trong trường hợp có khiếu nại từ khách hàng.`,
  `\u25CF Ghi nhận tình trạng thực tế trước khi sửa chữa để đánh giá hiệu quả công việc.`,
];


export const POST_REPAIR_BULLET_POINTS: string[] = [
  `\u25CF Đảm bảo có bằng chứng hoàn thành công việc trước khi kết thúc sửa chữa.`,
  `\u25CF Ghi nhận biên bản nghiệm thu để xác nhận việc sửa chữa đã hoàn tất.`,
  `\u25CF Lưu trữ ảnh và biên bản để đối chiếu trong trường hợp có khiếu nại sau này.`,
];

export function GetPreRepairHtml(preRepairImages:string[]) {    
  return  `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
            display:flex;
            flex-direction:column;
            justify-content:center;
          }
          h1 {
            text-align: left;
            font-size:3rem;
            color: #333;
          }
          .section {
            margin-bottom: 40px;
          }
          .image-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .image-container img {
            width: 1000px;
            height: 1000px;
            object-fit: cover;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="section">
          <h1>I. Hình trước sửa chữa</h1>
          <div class="image-container">
            ${preRepairImages
              .map((img) => `<img src="${img}" alt="Acceptance Report Image"/>`)
              .join("")}
          </div>
        </div>       
      </body>
    </html>
  `;
}

export function GetPostRepairHtml(acceptanceReportImages: string[], repairCompletedImages: string[]) {    
  return  `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;
            display:flex;
            flex-direction:column;
            justify-content:center;
          }
          h1 {
            text-align: left;
            font-size:3rem;
            color: #333;
          }
          .section {
            margin-bottom: 40px;
          }
          .image-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .image-container img {
            width: 1000px;
            height: 1000px;
            object-fit: cover;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <div class="section">
          <h1>I. Nghiệm Thu</h1>
          <div class="image-container">
            ${acceptanceReportImages
              .map((img) => `<img src="${img}" alt="Acceptance Report Image"/>`)
              .join("")}
          </div>
        </div>
        <div class="section">
          <h1>II. Bằng chứng hoàn thành sửa chữa</h1>
          <div class="image-container">
            ${repairCompletedImages
              .map((img) => `<img src="${img}" alt="Repair Completed Image"/>`)
              .join("")}
          </div>
        </div>
      </body>
    </html>
  `;
}
