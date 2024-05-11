use Medical_Schedule

go

-- Chèn dữ liệu vào bảng BacSi
INSERT INTO BacSi (IDBacSi, hoten, namSinh, SDT, gioiTinh, email, HocVan, Sonamcongtac)
VALUES 
    ('BS001', 'Nguyễn Văn A', 1980, 123456789, N'Nam', 'nguyenvana@example.com', N'Tiến sĩ', 10),
    ('BS002', 'Trần Thị B', 1975, 987654321, N'Nữ', 'tranthib@example.com', N'Thạc sĩ', 8);

-- Chèn dữ liệu vào bảng BenhNhan
INSERT INTO BenhNhan (IDBenhNhan, hoten, username, password, namSinh, diaChi, SDT, gioiTinh, email)
VALUES 
    ('BN001', N'Phạm Minh C', 'phamminhc', 'password123', 1990, N'Hà Nội', 987123456, 'Nam', 'phamminhc@example.com'),
    ('BN002', N'Lê Thị D', 'lethid', 'drowssap', 1985, N'Hồ Chí Minh', 987987987, 'Nữ', 'lethid@example.com');

-- Chèn dữ liệu vào bảng CaKham
INSERT INTO CaKham (KhungGio)
VALUES 
    ('Sáng'),
    ('Chiều'),
    ('Tối');

-- Chèn dữ liệu vào bảng Khoa
INSERT INTO Khoa (TenKhoa)
VALUES 
    (N'Nội khoa'),
    (N'Ngoại khoa');

-- Chèn dữ liệu vào bảng BacsiKhoa
INSERT INTO BacsiKhoa (IDBacSi, IDKhoa)
VALUES 
    ('BS001', 1),
    ('BS002', 2);

-- Chèn dữ liệu vào bảng DichVu
INSERT INTO DichVu (IDKhoa, TenDichVu, GiaKham)
VALUES 
    (1, N'Khám tổng quát', 100000),
    (2, N'Phẫu thuật đơn giản', 500000);

-- Chèn dữ liệu vào bảng LichLamViec
INSERT INTO LichLamViec (IDBacSi, IDKhoa, IDCa, Thu, soLuong)
VALUES 
    ('BS001', 1, 1, 2, 5),
    ('BS002', 2, 2, 4, 7);

-- Chèn dữ liệu vào bảng LichNghi
INSERT INTO LichNghi (IDCa, IDBacSi, NgayNghi)
VALUES 
    (1, 'BS001', '2024-05-12'),
    (2, 'BS002', '2024-05-15');
