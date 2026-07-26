/**
 * Nhúng JSON-LD vào HTML.
 *
 * Dùng dangerouslySetInnerHTML là cách Next.js khuyến nghị cho JSON-LD: nội
 * dung là dữ liệu do chính ta tạo từ object, không phải chuỗi từ người dùng,
 * nên không có đường cho mã lạ chèn vào. Vẫn thoát dấu `<` phòng trường hợp
 * sau này có ai nhét chuỗi chứa `</script>` vào dữ liệu.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
