use Medical_Schedule

go

--Trigger chuyển ngày sang thứ ngày đặt lịch

CREATE TRIGGER trg_ThemThu
ON LichDat
AFTER INSERT
AS
BEGIN
    UPDATE LichDat 
    SET ThuDatLich = DATEPART(WEEKDAY, inserted.NgayDatLich)
    FROM LichDat INNER JOIN inserted ON LichDat.NgayDatLich = inserted.NgayDatLich;
END;

go

--Trigger khi thêm 1 bác sĩ thò tự động tăng số lượng bác sĩ của Khoa 

CREATE TRIGGER trg_ThayDoiBacSi
ON BacsiKhoa
AFTER INSERT, DELETE, UPDATE
AS
BEGIN
    -- Cập nhật số lượng bác sĩ trong mỗi khoa sau khi thêm hoặc xóa bác sĩ
    UPDATE Khoa
    SET SoLuongBacSi = (
        SELECT COUNT(*)
        FROM BacsiKhoa
        WHERE BacsiKhoa.IDKhoa = Khoa.IDKhoa
    );
END;

go
