export function requestValuesGenerator(status?: string): {
  name: string;
  description: string;
} {
  switch (status) {
    case "getRequestPrice":
      return {
        name: "Giá tiền yêu cầu",
        description: "Giá tiền yêu cầu khi không đăng ký gói",
      };
    default:
      return { name: "", description: "" };
  }
}
