use Medical_Schedule
go
-- Insert sample data into Admin table
INSERT INTO Admin (Username, Password) VALUES
('admin1', 'adminpassword1'),
('admin2', 'adminpassword2');

-- Insert sample data into Khoa table
INSERT INTO Khoa (TenKhoa, MoTa, SoLuongBacSi) VALUES
(N'Khoa Tim mạch', N'Chuyên điều trị các bệnh về tim mạch', 5),
(N'Khoa Nhi', N'Chuyên điều trị các bệnh cho trẻ em', 3),
(N'Khoa Nội', N'Chuyên điều trị các bệnh nội khoa', 4),
(N'Khoa Ngoại', N'Chuyên điều trị các bệnh ngoại khoa', 4),
(N'Khoa Sản', N'Chuyên điều trị và chăm sóc phụ nữ mang thai', 3),
(N'Khoa Tai Mũi Họng', N'Chuyên điều trị các bệnh về tai mũi họng', 3),
(N'Khoa Da Liễu', N'Chuyên điều trị các bệnh về da', 2),
(N'Khoa Xương Khớp', N'Chuyên điều trị các bệnh về xương khớp', 3),
(N'Khoa Thần Kinh', N'Chuyên điều trị các bệnh về thần kinh', 3),
(N'Khoa Hô Hấp', N'Chuyên điều trị các bệnh về hô hấp', 2);

-- Insert sample data into BacSi table
INSERT INTO BacSi (hoten, [password], namSinh, SDT, gioiTinh, email, HocVan, Sonamcongtac, MoTa) VALUES
(N'Nguyễn Văn A', 'password1', 1980, '0123456789', 0, 'nguyenvana@example.com', N'Tiến sĩ Tim mạch', 10, N'Bác sĩ chuyên khoa Tim mạch với 10 năm kinh nghiệm'),
(N'Trần Thị B', 'password2', 1985, '0987654321', 1, 'tranthib@example.com', N'Thạc sĩ Nhi khoa', 8, N'Bác sĩ chuyên khoa Nhi với 8 năm kinh nghiệm');

-- Insert sample data into BenhNhan table
INSERT INTO BenhNhan (hoten, username, [password], namSinh, diaChi, SDT, gioiTinh, email) VALUES
(N'Phạm Văn C', 'phamvanc', 'password3', 1990, N'123 Đường ABC, Quận 1', '0123456788', 0, 'phamvanc@example.com'),
(N'Hoàng Thị D', 'hoangthid', 'password4', 1992, N'456 Đường DEF, Quận 2', '0987654322', 1, 'hoangthid@example.com');

-- Insert sample data into CaKham table
INSERT INTO CaKham (KhungGio) VALUES
(N'08:00 - 09:00'),
(N'09:00 - 10:00'),
(N'10:00 - 11:00'),
(N'13:00 - 14:00'),
(N'14:00 - 15:00'),
(N'15:00 - 16:00');

-- Insert sample data into BacsiKhoa table
INSERT INTO BacsiKhoa (IDBacSi, IDKhoa, ChucVu) VALUES
('BS000001', 1, N'Trưởng khoa'),
('BS000002', 2, N'Bác sĩ');

-- Insert sample data into LichLamViec table
INSERT INTO LichLamViec (IDBacSi, IDKhoa, IDCa, Thu) VALUES
('BS000001', 1, 1, 2), -- Thứ 2
('BS000001', 1, 2, 2), -- Thứ 2
('BS000001', 1, 3, 3), -- Thứ 3
('BS000002', 2, 4, 4), -- Thứ 4
('BS000002', 2, 5, 5); -- Thứ 5

-- Insert sample data into DichVu table
INSERT INTO DichVu (IDKhoa, TenDichVu, GiaKham) VALUES
(1, N'Khám Tim mạch cơ bản', 200000),
(1, N'Siêu âm Tim', 500000),
(2, N'Khám Nhi cơ bản', 150000),
(2, N'Tiêm phòng cho trẻ', 100000);

-- Insert sample data into LichDat table
INSERT INTO LichDat (IDCa, IDBenhNhan, IDBacSi, IDDichVu, ThuDatLich, NgayDatLich, TrangThai, TinhTrangThanhToan) VALUES
(1, 'BN000001', 'BS000001', 1, 2, '2023-06-20', 1, 0),
(2, 'BN000002', 'BS000002', 3, 3, '2023-06-21', 1, 1);
