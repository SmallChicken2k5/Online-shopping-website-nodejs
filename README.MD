# Backend Quản Lý Sản Phẩm

Dịch vụ backend quản lý sản phẩm (CRUD, phân quyền, giỏ hàng, đơn hàng, thống kê). Dự án dùng Node.js. Các file và thư mục hiện có phản ánh kiến trúc module tách rõ: cấu hình, models, controllers, helpers, middlewares, routes.

> Ghi chú: README này được tạo dựa trên cấu trúc thư mục hiện có. Bổ sung chi tiết (DB thực tế, ví dụ API, logic nghiệp vụ) nếu cần.

## Mục Lục
- [Tính Năng Chính](#tính-năng-chính)
- [Kiến Trúc & Thư Mục](#kiến-trúc--thư-mục)
- [Yêu Cầu](#yêu-cầu)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình Môi Trường (.env)](#cấu-hình-môi-trường-env)
- [Scripts npm](#scripts-npm)
- [Thư Viện / Dependencies](#thư-viện--dependencies)
- [Luồng Hoạt Động Tổng Quan](#luồng-hoạt-động-tổng-quan)
- [Models](#models)
- [Helpers](#helpers)
- [Middlewares](#middlewares)
- [Triển Khai](#triển-khai)
- [Phát Triển](#phát-triển)
- [Gợi Ý Mở Rộng](#gợi-ý-mở-rộng)
- [License](#license)
- [Tác Giả](#tác-giả)

## Tính Năng Chính
- Quản lý sản phẩm & phân loại
- Tài khoản & phân quyền (role)
- Giỏ hàng, đơn hàng
- Quên mật khẩu (token)
- Thống kê / báo cáo
- Upload (multer)
- Tìm kiếm, phân trang, lọc trạng thái
- Gửi mail

## Kiến Trúc & Thư Mục
- Điểm vào: [index.js](index.js)
- Cấu hình: [config/database.js](config/database.js), [config/system.js](config/system.js)
- Models: thư mục [models/](models/)
- Controllers: [controllers/admin/](controllers/admin/), [controllers/client/](controllers/client/)
- Middlewares: [middlewares/admin/](middlewares/admin/), [middlewares/client/](middlewares/client/)
- Helpers: [helpers/](helpers/)
- Routes (routers): [routers/](routers/)
- Validate: [validates/](validates/)
- Tài nguyên tĩnh: [public/](public/)
- Cấu hình triển khai Vercel: [vercel.json](vercel.json)
- Metadata dự án: [package.json](package.json)
- Môi trường: [.env](.env)

## Yêu Cầu
- Node.js >= 16
- (Khả năng) MongoDB (dựa vào hậu tố *.model.js) – xác nhận lại
- SMTP (nếu dùng gửi mail)
- Vercel (nếu triển khai serverless)

## Cài Đặt
```bash
npm install
npm start
```

## Cấu Hình Môi Trường (.env)
Ví dụ (tùy chỉnh theo thực tế):
```
PORT  
MONGODB_URL 

CLOUD_NAME
API_KEY 
API_SECRET 

EMAIL_USER
EMAIL_PASS 
```

## Scripts npm
Xem [package.json](package.json). Thông dụng:
```bash
npm start           # Chạy server
npm run dev         # (Nếu có) nodemon
npm run lint        # (Nếu cấu hình)
```

## Thư Viện / Dependencies
Chưa có package.json trong ngữ cảnh, danh sách dưới đây là mẫu thường gặp. Cập nhật lại theo thực tế.
Core / HTTP:
- express
CSDL:
- mongoose (nếu dùng MongoDB)
Cấu hình / tiện ích:
- dotenv
- cors
- morgan (logging)
- cookie-parser
Auth & bảo mật:
- bcrypt hoặc bcryptjs
- jsonwebtoken
Upload & media:
- multer
Email:
- nodemailer
Slug / xử lý chuỗi (nếu cần):
- slugify
Phân trang / tìm kiếm (có thể tự viết helper, không cần lib ngoài)
Dev:
- nodemon (chạy dev)
- eslint, prettier (nếu cấu hình)
Test (tùy chọn):
- jest hoặc mocha + chai + supertest
Gợi ý xác thực danh sách thực tế:
```bash
npm ls --depth=0
cat package.json
```
Cập nhật mục này sau khi chốt dependencies.

## Luồng Hoạt Động Tổng Quan
1. Request đến (client / admin) route
2. Middlewares xác thực / phân quyền
3. Controller xử lý
4. Model thao tác DB
5. Helpers hỗ trợ (paginate, search, filter, gửi mail, thống kê)
6. Trả JSON / render view (nếu có template engine)

## Models
- Tài khoản: [models/account.model.js](models/account.model.js)
- Vai trò: [models/role.model.js](models/role.model.js)
- Sản phẩm: [models/product.model.js](models/product.model.js)
- Danh mục sản phẩm: [models/product-category.model.js](models/product-category.model.js)
- Giỏ hàng: [models/cart.model.js](models/cart.model.js)
- Đơn hàng: [models/order.model.js](models/order.model.js)
- Quên mật khẩu: [models/forgot-password.model.js](models/forgot-password.model.js)
- ... (các file khác nếu có)

## Helpers
- Cây danh mục: [helpers/createTree.js](helpers/createTree.js)
- Lọc trạng thái: [helpers/filterStatus.js](helpers/filterStatus.js)
- Sinh dữ liệu / mã: [helpers/generate.js](helpers/generate.js)
- Phân trang: [helpers/pagination.js](helpers/pagination.js)
- Danh mục sản phẩm logic: [helpers/productCategory.js](helpers/productCategory.js)
- Sản phẩm logic: [helpers/products.js](helpers/products.js)
- Tìm kiếm: [helpers/search.js](helpers/search.js)
- Gửi mail: [helpers/sendMail.js](helpers/sendMail.js)
- Thống kê: [helpers/statistic.js](helpers/statistic.js)
- Upload (multer): [helpers/storageMulter.js](helpers/storageMulter.js)

## Middlewares
- Admin middlewares: [middlewares/admin/](middlewares/admin/)
- Client middlewares: [middlewares/client/](middlewares/client/)
(Thường gồm: auth, role-based access, validation)

## Triển Khai
- Vercel: cấu hình tại [vercel.json](vercel.json)
- Lưu ý:
    - Thiết lập biến môi trường trên Vercel
    - Nếu dùng kết nối persistent DB (MongoDB Atlas), đảm bảo whitelist IP

## Phát Triển
- Thêm route: tạo file trong [routers/](routers/) và gắn vào app ở [index.js](index.js)
- Thêm model: tạo file trong [models/](models/) và import vào controller
- Viết helper tái sử dụng để tránh trùng lặp
- Viết middleware xác thực trước controller

## Gợi Ý Mở Rộng
- Thêm OpenAPI (swagger)
- Thêm test (Jest / Mocha)
- Thêm logger (winston/pino)
- Rate limiting & security headers
- Docker hoá
- CI lint & test

## License
Cập nhật giấy phép (MIT / ISC / Proprietary).

## Tác Giả
Thái Hồ Phú Gia

---
Cập nhật README khi bổ sung