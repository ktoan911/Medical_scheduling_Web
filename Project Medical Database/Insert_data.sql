-- Inserting data into BacSi table
INSERT INTO BacSi (hoten, [password], namSinh, SDT, gioiTinh, email, HocVan, Sonamcongtac, MoTa)
VALUES 
(N'Nguyễn Văn A', 'pass123', 1980, '1234567890', 0, 'nva@example.com', N'Tiến sĩ', 15, 'Bác sĩ nội khoa'),
(N'Trần Thị B', 'pass456', 1985, '1234567890', 1, 'ttb@example.com', N'Tiến sĩ', 10, 'Bác sĩ ngoại khoa'),
(N'Phạm Văn C', 'pass789', 1990, '1234567890', 0, 'pvc@example.com', N'Tiến sĩ', 5, 'Bác sĩ ngoại khoa');

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
INSERT INTO Khoa (TenKhoa, MoTa)
VALUES 
(N'Khoa Tim mạch', N'Chuyên khoa về các vấn đề tim và hệ thống tuần hoàn'),
(N'Khoa Phẫu thuật tim mạch', N'Chuyên về phẫu thuật tim mạch, bao gồm cả phẫu thuật cấp cứu và phẫu thuật lập kế hoạch để điều trị các bệnh tim nặng'),
(N'Khoa Điều trị cấp cứu', N'Đối phó với các tình trạng cấp cứu liên quan đến tim mạch như đau ngực cấp, nhồi máu cơ tim, hay rối loạn nhịp tim'),
(N'Khoa Y học hạt nhân', N'Sử dụng kỹ thuật hạt nhân để chẩn đoán và điều trị các bệnh tim mạch'),
(N'Khoa Y học nội soi', N'Sử dụng các phương pháp can thiệp không xâm lấn như thang đo áp dụng hoặc stent để điều trị các vấn đề như tắc nghẽn động mạch vành'),
(N'Khoa Y học nhịp tim', N'Chuyên về chẩn đoán và điều trị các rối loạn nhịp tim'),
(N'Khoa Hồi sức tim mạch', N'Hỗ trợ bệnh nhân phục hồi sau khi đã trải qua các biến cố tim mạch hoặc phẫu thuật'),
(N'Khoa Y học tim trẻ em', N'Chuyên về chẩn đoán và điều trị các vấn đề tim mạch ở trẻ em');


-- Inserting data into BacsiKhoa table
INSERT INTO BacsiKhoa (IDBacSi, IDKhoa,ChucVu)
VALUES 
('BS000001', 1, N'Trưởng khoa'),
('BS000002', 1, N'Phó Khoa'),
('BS000003', 1, N'Phó Khoa'),
('BS000002', 2, N'Bác sĩ'),
('BS000003', 2,N'Bác sĩ');

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


