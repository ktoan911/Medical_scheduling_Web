use Medical_Schedule
GO

--Đăng kí bệnh nhân
CREATE PROCEDURE pRegister_BN
@email varchar(30), @hoten nvarchar(50), @user_name varchar(50), @password varchar(30)
WITH ENCRYPTION
AS 
Begin
    -- Kiểm tra xem tên đăng nhập đã tồn tại chưa
    IF EXISTS (
        SELECT 1
        FROM BenhNhan
        WHERE [username] = @user_name
    )
	BEGIN
        -- Nếu tên đăng nhập đã tồn tại, trả về thông báo lỗi
        SELECT 'Username already exists' AS Message;
    END

    ELSE
	Begin
		--Băm mật khẩu
		DECLARE @PasswordHash NVARCHAR(256);
		SET @PasswordHash = HASHBYTES('SHA2_256', @password);

		INSERT INTO BenhNhan (hoten, username, [password], email)
		VALUES (@hoten, @user_name, @PasswordHash, @email);

		SELECT 'Registration successful' AS Message;
	END
END
GO

--EXEC pRegister_BN @hoten = N'Tên Bệnh Nhân', @user_name = 'tendangnhap', @password = 'matkhau', @email = 'helo@gmail.com';

--Đăng nhập bệnh nhân
CREATE PROCEDURE pLogin_BN
@Username varchar(50), @Password varchar(30)
WITH ENCRYPTION
AS 
Begin
DECLARE @PasswordHash NVARCHAR(256);

    -- Băm mật khẩu đầu vào để so sánh với mật khẩu đã lưu
    SET @PasswordHash = HASHBYTES('SHA2_256', @Password);

    -- Kiểm tra xem có người dùng nào có tên đăng nhập và mật khẩu băm này không
    IF EXISTS (
        SELECT 1
        FROM BenhNhan
        WHERE [username] = @Username AND [password] = @PasswordHash
    )
    BEGIN
        -- Nếu tìm thấy, trả về thành công
        SELECT 'Login successful' AS Message;
    END
    ELSE
    BEGIN
        -- Nếu không tìm thấy, trả về thất bại
        SELECT 'Invalid username or password' AS Message;
    END
END
go

--EXEC pLogin_BN @Username = 'tendangnhap', @Password = 'matkhau';

--Đăng kí cho bác sĩ
CREATE PROCEDURE pRegister_BS
    @hoten NVARCHAR(50),
    @password VARCHAR(30),
    @namSinh INT,
    @SDT CHAR(10),
    @gioiTinh INT = 0, -- mặc định là nam
    @ChucVu NVARCHAR(40),
    @HocVan NVARCHAR(40),
    @Sonamcongtac INT,
    @Email VARCHAR(30)
WITH ENCRYPTION
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NewIDBacSi NVARCHAR(10);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Chèn vào bảng BacSi
        INSERT INTO BacSi (hoten, [password], namSinh, SDT, gioiTinh, ChucVu, HocVan, Sonamcongtac, email)
        VALUES (@hoten, @password, @namSinh, @SDT, @gioiTinh, @ChucVu, @HocVan, @Sonamcongtac, @Email);

        -- Lấy mã bác sĩ mới được chèn
        SELECT @NewIDBacSi = IDBacSi
        FROM BacSi
        WHERE id = SCOPE_IDENTITY();

        COMMIT TRANSACTION;

        -- Trả về mã bác sĩ mới được chèn
        SELECT @NewIDBacSi AS NewIDBacSi;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Xử lý lỗi nếu có
        DECLARE @ErrorMessage NVARCHAR(4000);
        DECLARE @ErrorSeverity INT;
        DECLARE @ErrorState INT;

        SELECT 
            @ErrorMessage = ERROR_MESSAGE(),
            @ErrorSeverity = ERROR_SEVERITY(),
            @ErrorState = ERROR_STATE();

        RAISERROR (@ErrorMessage, @ErrorSeverity, @ErrorState);
    END CATCH
END;
go

/*
EXEC pRegister_BS
    @hoten = N'Nguyễn Văn A',
    @password = 'paspspdword123',
    @namSinh = 1980,
    @SDT = '0123456789',
    @gioiTinh = 0,
    @email = 'nvdpwla@example.com',
    @ChucVu = N'Bác sĩ',
    @HocVan = N'Tiến sĩ Y khoa',
    @Sonamcongtac = 10;
*/




--Đăng nhập bác sĩ ( không sử dụng băm )
CREATE PROCEDURE pLogin_BS
@ID_BacSi varchar(50), @Password varchar(30)
WITH ENCRYPTION
AS 
Begin
    IF EXISTS (
        SELECT 1
        FROM BacSi
        WHERE IDBacSi = @ID_BacSi AND [password] = @Password
    )
    BEGIN
        -- Nếu tìm thấy, trả về thành công
        SELECT 'Login successful' AS Message;
    END
    ELSE
    BEGIN
        -- Nếu không tìm thấy, trả về thất bại
        SELECT 'Invalid username or password' AS Message;
    END
END
go

--EXEC pLogin_BS @ID_BacSi = 'BS000001', @Password = 'pass123';






