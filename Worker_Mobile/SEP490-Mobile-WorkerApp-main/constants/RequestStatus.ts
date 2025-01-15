export type RequestStatusTimelineItem = {        
    title: string,
    description:string,
}

export const REQUEST_STATUS_TIMELINE_ITEMS: RequestStatusTimelineItem[] = [

  {     
    title: "Đã hoàn thành",
    description: "Công việc sửa chữa đã được hoàn tất và nghiệm thu.",
    },
   
  {       
    title: "Đang xử lý",
    description: "Kỹ thuật viên đang trên đường đến địa điểm sửa chữa.",
    },
       {    
    title: "Yêu cầu mới",
    description: "Khách hàng đã gửi yêu cầu về sửa chữa điện.",
  },
]