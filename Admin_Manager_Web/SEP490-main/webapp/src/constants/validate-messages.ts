const typeTemplate = "${label} không hợp lệ";

export const validateMessages = {
  default: "${label} không hợp lệ",
  required: "Vui lòng nhập ${label}",
  enum: "${label} phải là một trong những giá trị sau:  ${enum}",
  whitespace: "${label} không thể là khoảng trắng",
  date: {
    format: "Lỗi định dạng",
    parse: "${label} không thể định dạng sang ngày",
    invalid: "${label} không phải là ngày hợp lệ",
  },
  types: {
    email: typeTemplate,
    number: typeTemplate,
    string: typeTemplate,
    method: typeTemplate,
    array: typeTemplate,
    object: typeTemplate,
    date: typeTemplate,
    boolean: typeTemplate,
    integer: typeTemplate,
    float: typeTemplate,
    regexp: typeTemplate,
    url: typeTemplate,
    hex: typeTemplate,
  },
  string: {
    len: "Độ dài ${label} không hợp lệ",
    min: "${label} phải có ít nhất ${min} ký tự",
    max: "${label} có nhiều nhất ${max} ký tự",
    range: "${label} phải trong khoảng ${min}-${max} ký tự",
  },
  number: {
    len: "${label} phải có ${len} ký tự",
    min: "${label} phải ít nhất ${min}",
    max: "${label} nhiều nhất ${max}",
    range: "${label} phải trong khoảng ${min}-${max}",
  },
  array: {
    len: "Phải có ${len} ${label}",
    min: "phái có ít nhất ${min} ${label}",
    max: "Nhiều nhất ${max} ${label}",
    range: "Số lượng ${label} phải nằm trong khoảng ${min}-${max}",
  },
  pattern: {
    mismatch: "${label} không hợp lệ",
  },
};
