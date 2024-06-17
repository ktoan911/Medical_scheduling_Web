
const config = {
    user: 'sa',
    password: '12345678',
    server: 'NHATQUANG\\MSSQLSERVER01', // Máy chủ của bạn, ví dụ 'localhost'
    port: 1433, // Cổng mặc định của SQL Server
    database: 'Medical_Schedule',
    options: {
      encrypt: true, // Sử dụng mã hóa nếu cần thiết
      enableArithAbort: true, // Kích hoạt kiểm tra lỗi số học
      trustServerCertificate: true,
    }
  };
  
  module.exports = config;
  