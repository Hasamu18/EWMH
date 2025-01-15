import { Product } from "@/models/Product";

export const PRODUCTS: Product[] = [
  {
    productId: "abcd-1234-efgh-5678",
    name: "Đèn LED tiết kiệm điện",
    inOfStock: 1,
    imageUrl:
      "https://ledduhal.net/wp-content/uploads/2019/01/bong-den-led-15w-sbnl515.jpg?v=1637415877",
    status: true,
    priceByDate: 400000,
  },
  {
    productId: "ijkl-9012-mnop-3456",
    name: "Vòi nước cảm ứng",
    inOfStock: 1,
    imageUrl: "https://sieuthidienthongminh.vn/media/product/334_sh_f66.jpg",
    status: true,
    priceByDate: 150000,
  },
  {
    productId: "qrst-7890-uvwx-1234",
    name: "Bóng đèn thông minh",
    inOfStock: 0,
    imageUrl:
      "https://product.hstatic.net/1000111355/product/el52710w__26__55dc1dbfb53d4542ac703ee04b78ddcc.jpg",
    status: false,
    priceByDate: 350000,
  },
  {
    productId: "yzab-5678-cdef-9012",
    name: "Máy bơm nước tự động",
    inOfStock: 1,
    imageUrl: "https://sieuthidienthongminh.vn/media/product/334_sh_f66.jpg",
    status: true,
    priceByDate: 250000,
  },
  {
    productId: "ghij-3456-klmn-7890",
    name: "Công tắc điện thông minh",
    inOfStock: 0,
    imageUrl:
      "https://bizweb.dktcdn.net/100/089/254/products/touch-3-nhom-vien-gold-mat-den-2.jpg?v=1546019332067",
    status: false,
    priceByDate: 1200000,
  },
];
