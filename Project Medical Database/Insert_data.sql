-- Inserting data into BacSi table
INSERT INTO BacSi (hoten, [password], namSinh, SDT, gioiTinh, email, ChucVu, HocVan, Sonamcongtac)
VALUES 
(N'Nguyễn Văn A', 'pass123', 1980, '1234567890', 0, 'nva@example.com', N'Trưởng khoa', N'Tiến sĩ', 15),
(N'Trần Thị B', 'pass456', 1985, '1234567890', 1, 'ttb@example.com', N'Bác sĩ', N'Tiến sĩ', 10),
(N'Phạm Văn C', 'pass789', 1990, '1234567890', 0, 'pvc@example.com', N'Phó Khoa', N'Tiến sĩ', 5);

-- Inserting data into BenhNhan table
INSERT INTO BenhNhan (hoten, username, [password], namSinh, diaChi, SDT, gioiTinh, email)
VALUES 
(N'Nguyễn Thị D', 'nguyenthid', 'bn123', 1988, N'Hà Nội', '1234567890', 1, 'ntd@example.com'),
(N'Lê Văn E', 'levane', 'bn456', 1975, N'Hồ Chí Minh', '1234567890', 0, 'lve@example.com');


-- Inserting data into CaKham table
INSERT INTO CaKham (KhungGio)
VALUES 
('08:00 - 10:00'),
('10:00 - 12:00'),
('13:00 - 15:00');

-- Inserting data into Khoa table
INSERT INTO Khoa (TenKhoa, MoTa, SoLuongBacSi)
VALUES 
(N'Nội khoa', N'Chuyên khoa về các bệnh nội sinh', 3),
(N'Ngoại khoa', N'Chuyên khoa về các bệnh ngoại tổng quát', 2);

-- Inserting data into BacsiKhoa table
INSERT INTO BacsiKhoa (IDBacSi, IDKhoa)
VALUES 
('BS000001', 1),
('BS000002', 1),
('BS000003', 1),
('BS000002', 2),
('BS000003', 2);

-- Inserting data into LichLamViec table
INSERT INTO LichLamViec (IDBacSi, IDKhoa, IDCa, Thu)
VALUES 
('BS000001', 1, 1, 2),
('BS000001', 1, 2, 3),
('BS000002', 1, 1, 4),
('BS000002', 1, 2, 5),
('BS000003', 1, 1, 6),
('BS000003', 1, 2, 7);

-- Inserting data into DichVu table
INSERT INTO DichVu (IDKhoa, TenDichVu, GiaKham)
VALUES 
(1, N'Kiểm tra tổng quát', 200000),
(1, N'Siêu âm', 300000),
(2, N'Phẫu thuật thận', 5000000),
(2, N'Xét nghiệm máu', 400000);

-- Inserting data into LichDat table
INSERT INTO LichDat (IDCa, IDBenhNhan, IDBacSi, IDDichVu, NgayDatLich)
VALUES 
(1, 'BN000001', 'BS000001', 1, GETDATE()),
(2, 'BN000002', 'BS000002', 2, GETDATE());

-- Inserting data into LichNghi table
INSERT INTO LichNghi (IDCa, IDBacSi, ThuNghi, NgayNghi)
VALUES 
(1, 'BS000001', 4, '2024-05-16'),
(2, 'BS000002', 5, '2024-05-17');

