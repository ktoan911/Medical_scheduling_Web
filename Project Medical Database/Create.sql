use master
go

drop database Medical_Schedule
go

IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'Medical_Schedule')
BEGIN
    CREATE DATABASE Medical_Schedule;
END;
go

use Medical_Schedule
go


create table BacSi (
	id int identity(1,1),
	IDBacSi AS ('BS'+  RIGHT('000000'+CAST(id as varchar(6)),6)) PERSISTED,
	hoten nvarchar(50) not null,
	[password] varchar(30) not null,
	namSinh int not null,
	SDT char(10) not null,
	gioiTinh int default 0, -- 0 là nam 1 là nữ
	email varchar(30) not null UNIQUE,
	HocVan nvarchar(40) not null,
	Sonamcongtac int not null,
	MoTa nvarchar(max) not null,

	CONSTRAINT PK_BacSi PRIMARY KEY (IDBacSi)
);




create table BenhNhan(
	id int identity(1,1),
	IDBenhNhan AS ('BN'+ RIGHT('000000'+CAST(id as varchar(6)),6)) PERSISTED,
	hoten nvarchar(50) not null,
	username varchar(50) not null,
	[password] nvarchar(256) not null,
	namSinh int,
	diaChi nvarchar(50),
	SDT char(10),
	gioiTinh int default 0, -- 0 là nam 1 là nữ
	email varchar(30) not null,
	SoLanHuy int default 0,
	
	UNIQUE([username]),
	CONSTRAINT PK_BenhNhan PRIMARY KEY (IDBenhNhan)
);

create table CaKham(
	IDCa int identity(1,1) NOT NULL,
	KhungGio varchar(20) NOT NULL UNIQUE,

	CONSTRAINT PK_CaKham PRIMARY KEY (IDCa)
);

create table Khoa(
	IDKhoa int identity(1,1) NOT NULL,
	TenKhoa nvarchar(50) not null,
	MoTa  nvarchar(max),
	SoLuongBacSi int default 0,

	CONSTRAINT PK_Khoa PRIMARY KEY (IDKhoa) 
);

create table BacsiKhoa(
	IDBacSi varchar(8) not null,
	IDKhoa int not null, 
	ChucVu nvarchar(40) not null,

	UNIQUE(IDKhoa, IDBacSi),
	CONSTRAINT PK_BacSiKhoa PRIMARY KEY (IDKhoa,IDBacSi),
	CONSTRAINT FK_BacSiKhoa1 FOREIGN KEY (IDBacSi) REFERENCES BacSi(IDBacSi),
	CONSTRAINT FK_BacSiKhoa2 FOREIGN KEY (IDKhoa) REFERENCES Khoa(IDKhoa),
	CONSTRAINT CK_ChucVu_Format CHECK (ChucVu IN (N'Trưởng khoa', N'Phó Khoa', N'Bác sĩ', N'Thực tập sinh'))
);

go
CREATE INDEX idx_chucvu
ON BacsiKhoa (ChucVu);
go


CREATE TABLE LichLamViec (
    IDLich INT IDENTITY(1,1) ,
    IDBacSi varchar(8) not null,
	IDKhoa int not null,
    IDCa INT not null,
    Thu INT NOT NULL,

	UNIQUE(IDBacSi,Thu,IDCa),
	CONSTRAINT CK_Thu CHECK (Thu >= 2 AND Thu <= 7),
	CONSTRAINT PK_LichLamViec PRIMARY KEY (IDLich),
	CONSTRAINT FK_LichLamViec1 FOREIGN KEY (IDBacSi) REFERENCES BacSi(IDBacSi),
	CONSTRAINT FK_LichLamViec2 FOREIGN KEY (IDKhoa) REFERENCES Khoa(IDKhoa),
	CONSTRAINT FK_LichLamViec3 FOREIGN KEY (IDCa) REFERENCES CaKham(IDCa)
);

go
CREATE INDEX idx_idbsLichlamviec
ON LichLamViec (IDBacSi);
go

Create table DichVu (
	IDDichVu int identity(1,1) not null,
	IDKhoa int not null,
	TenDichVu nvarchar(200) not null,
	GiaKham int not null,

	CONSTRAINT PK_DV PRIMARY KEY (IDDichVu) ,
	CONSTRAINT FK_DV FOREIGN KEY (IDKhoa) references Khoa(IDKhoa)
);

--CHECK trống lịch bằng cách xem bác sĩ có ca cần tìm không, sau đó check ngày đó bác sĩ đó nghỉ ca nào
CREATE TABLE LichDat(
	IDLichDat int identity(1,1), 
	IDCa INT not null,
	IDBenhNhan varchar(8) not null,
	IDBacSi varchar(8) not null,
	IDDichVu int not null,
	ThuDatLich int, -- cần tạo trigger
	NgayDatLich date not null default getdate(),
	TrangThai int not null default 1,
	TinhTrangThanhToan int not null default 0,
	
	UNIQUE(IDBenhNhan, IDCa, NgayDatLich),
	CONSTRAINT CK_TrangThai CHECK (TrangThai IN (0, 1)),
	CONSTRAINT CK_TinhTrangThanhToan CHECK (TinhTrangThanhToan IN (0, 1)),
	CONSTRAINT PK_Lich_Dat PRIMARY KEY (IDLichDat),
	CONSTRAINT FK_Lich_Dat1 FOREIGN KEY (IDCa) REFERENCES CaKham(IDCa),
	CONSTRAINT FK_Lich_Dat2 FOREIGN KEY (IDBacSi) REFERENCES BacSi(IDBacSi),
	CONSTRAINT FK_Lich_Dat3 FOREIGN KEY (IDBenhNhan) REFERENCES BenhNhan(IDBenhNhan),
	CONSTRAINT FK_Lich_Dat4 FOREIGN KEY (IDDichVu) REFERENCES DichVu(IDDichVu)
);

go

--Insert Khoa table
INSERT INTO Khoa (TenKhoa, MoTa)
VALUES 
(N'Khoa Tim mạch', N'Khoa Tim mạch là một trong những khoa chính của bệnh viện tim, chuyên sâu trong việc chẩn đoán, điều trị và quản lý các vấn đề liên quan đến tim và hệ thống tuần hoàn của cơ thể. Các bệnh lý tim mạch có thể bao gồm bệnh tim đau, nhồi máu cơ tim, bệnh van tim, rối loạn nhịp tim và nhiều hơn nữa. Khoa này có vai trò quan trọng trong việc cung cấp điều trị hiệu quả và chăm sóc toàn diện cho bệnh nhân với các vấn đề tim mạch. Các dịch vụ trong khoa này có thể bao gồm các xét nghiệm điện tâm đồ, siêu âm tim, thử nghiệm chức năng tim, và cả quản lý bệnh nhân sau khi đã trải qua các ca phẫu thuật tim mạch. Khoa cũng tổ chức các chương trình tư vấn và giáo dục sức khỏe để giúp bệnh nhân và gia đình hiểu rõ hơn về các bệnh lý tim mạch, cách phòng ngừa và quản lý bệnh tình hiệu quả. Bên cạnh đó, các bác sĩ và nhân viên y tế trong khoa luôn cập nhật những tiến bộ mới nhất trong y học để áp dụng vào quá trình điều trị, mang lại kết quả tốt nhất cho bệnh nhân.'),
(N'Khoa Phẫu thuật tim mạch', N'Khoa Phẫu thuật tim mạch chuyên sâu trong việc thực hiện các ca phẫu thuật tim mạch phức tạp. Các ca phẫu thuật có thể bao gồm cả phẫu thuật mở và phẫu thuật thông qua cánh tay với sự hỗ trợ của robot. Những ca phẫu thuật này thường được thực hiện để điều trị tắc nghẽn động mạch vành, khối u tim hoặc các bệnh lý khác gây ra sự suy yếu của cơ tim. Khoa còn có vai trò quan trọng trong việc theo dõi và chăm sóc bệnh nhân trước và sau phẫu thuật, đảm bảo họ phục hồi mạnh mẽ và có chất lượng cuộc sống tốt sau điều trị. Ngoài ra, khoa còn thực hiện các chương trình nghiên cứu và thử nghiệm lâm sàng để tìm ra các phương pháp phẫu thuật mới và hiệu quả hơn. Nhân viên y tế trong khoa luôn đảm bảo rằng họ cung cấp cho bệnh nhân sự chăm sóc tốt nhất, từ khâu chuẩn bị trước phẫu thuật đến quá trình hồi phục sau phẫu thuật, với mục tiêu nâng cao sức khỏe và chất lượng cuộc sống của bệnh nhân.'),
(N'Khoa Điều trị cấp cứu', N'Khoa Điều trị cấp cứu tập trung vào việc cung cấp chăm sóc ngay lập tức cho bệnh nhân gặp các tình trạng tim mạch cấp tính, như đau ngực cấp, nhồi máu cơ tim hoặc rối loạn nhịp tim nguy hiểm. Các bác sĩ và nhân viên y tế trong khoa này phải có kỹ năng và kiến thức để đánh giá và xử lý tình huống khẩn cấp một cách nhanh chóng và chính xác. Khoa cũng đảm bảo rằng các bệnh nhân nhận được điều trị và quản lý tốt nhất trong thời gian vàng quý giá sau khi gặp sự cố tim mạch. Ngoài việc điều trị cấp cứu, khoa còn tập trung vào công tác đào tạo và huấn luyện nhân viên y tế, nhằm nâng cao khả năng phản ứng và xử lý trong các tình huống khẩn cấp. Khoa cũng hợp tác với các đơn vị khác trong bệnh viện để đảm bảo sự phối hợp hiệu quả và nhanh chóng trong việc điều trị và chăm sóc bệnh nhân. Điều này giúp tối ưu hóa quá trình điều trị và tăng cơ hội sống sót và hồi phục cho bệnh nhân.'),
(N'Khoa Y học hạt nhân', N'Khoa Y học hạt nhân sử dụng kỹ thuật hạt nhân để chẩn đoán và điều trị các bệnh tim mạch. Phương pháp hạt nhân thường bao gồm cả hình ảnh chụp cắt lớp và xác định chức năng của cơ tim thông qua việc sử dụng các phương pháp hình ảnh hạt nhân như PET/CT, SPECT/CT và MRI hạt nhân. Khoa này cung cấp những thông tin chi tiết về cấu trúc và hoạt động của tim, giúp bác sĩ đưa ra quyết định chính xác về điều trị cho bệnh nhân. Ngoài ra, khoa còn tham gia vào các nghiên cứu tiên tiến để cải tiến kỹ thuật và phương pháp điều trị, nhằm mang lại hiệu quả cao hơn và ít tác dụng phụ hơn cho bệnh nhân. Khoa Y học hạt nhân cũng đóng vai trò quan trọng trong việc đào tạo và phát triển nguồn nhân lực chuyên môn cao, đảm bảo rằng các kỹ thuật viên và bác sĩ luôn cập nhật những kiến thức và công nghệ mới nhất trong lĩnh vực y học hạt nhân.'),
(N'Khoa Y học nội soi', N'Khoa Y học nội soi chuyên sâu vào việc sử dụng các phương pháp can thiệp không xâm lấn để điều trị các vấn đề tim mạch. Các kỹ thuật nội soi thường bao gồm thang đo áp dụng, cắt động mạch vành bằng cách sử dụng đầu nhọn và chích thuốc giảm đau trực tiếp vào vùng tắc nghẽn. Khoa này là lựa chọn phù hợp cho những bệnh nhân không thể hoặc không muốn chịu phẫu thuật truyền thống, mang lại lợi ích lớn trong việc giảm đau và hồi phục sau can thiệp. Khoa còn cung cấp các dịch vụ theo dõi và chăm sóc sau can thiệp để đảm bảo rằng bệnh nhân hồi phục nhanh chóng và không gặp biến chứng. Các bác sĩ và nhân viên y tế trong khoa luôn nỗ lực nghiên cứu và áp dụng các kỹ thuật mới, tối ưu hóa quá trình điều trị và cải thiện chất lượng cuộc sống của bệnh nhân. Khoa cũng thực hiện các chương trình giáo dục và tư vấn để bệnh nhân hiểu rõ hơn về các phương pháp điều trị và cách tự chăm sóc sau khi can thiệp.'),
(N'Khoa Y học nhịp tim', N'Khoa Y học nhịp tim chuyên về chẩn đoán và điều trị các rối loạn nhịp tim. Các bệnh lý nhịp tim có thể bao gồm nhịp tim nhanh, nhịp tim chậm, hay nhịp tim không đều. Bằng cách sử dụng các thiết bị theo dõi nhịp tim và quản lý thuốc, bệnh viện có thể cung cấp các phương pháp điều trị phù hợp với từng trường hợp. Khoa này thường liên kết chặt chẽ với các chuyên gia điện tim để đảm bảo chất lượng chăm sóc tốt nhất cho bệnh nhân. Ngoài ra, khoa còn tham gia vào các chương trình nghiên cứu về nhịp tim để tìm ra các phương pháp điều trị mới và hiệu quả hơn. Khoa Y học nhịp tim cũng tổ chức các chương trình tư vấn và giáo dục sức khỏe để giúp bệnh nhân và gia đình hiểu rõ hơn về các rối loạn nhịp tim và cách phòng ngừa, quản lý bệnh tình.'),
(N'Khoa Hồi sức tim mạch', N'Khoa Hồi sức tim mạch chuyên trách việc chăm sóc và theo dõi bệnh nhân trong giai đoạn hồi phục sau các can thiệp hoặc phẫu thuật tim mạch. Khoa này đóng vai trò quan trọng trong việc đảm bảo bệnh nhân hồi phục hoàn toàn và không gặp phải các biến chứng sau điều trị. Các dịch vụ của khoa bao gồm theo dõi liên tục các dấu hiệu sinh tồn, quản lý thuốc và điều chỉnh các phương pháp điều trị phù hợp. Khoa còn tổ chức các chương trình tập luyện và phục hồi chức năng tim mạch, giúp bệnh nhân nhanh chóng trở lại cuộc sống bình thường. Ngoài ra, các bác sĩ và nhân viên y tế trong khoa luôn sẵn sàng hỗ trợ tâm lý và cung cấp thông tin cần thiết để bệnh nhân và gia đình yên tâm trong quá trình hồi phục. Khoa Hồi sức tim mạch cũng tham gia vào các nghiên cứu và đào tạo để cải tiến quy trình chăm sóc và điều trị, đảm bảo rằng bệnh nhân nhận được sự chăm sóc tốt nhất.'),
(N'Khoa Nội tiết tim mạch', N'Khoa Nội tiết tim mạch tập trung vào nghiên cứu và điều trị các bệnh lý liên quan đến nội tiết và tim mạch, như bệnh đái tháo đường và các rối loạn chuyển hóa. Khoa này cung cấp các phương pháp điều trị tiên tiến và cá nhân hóa, đảm bảo rằng mỗi bệnh nhân nhận được sự chăm sóc phù hợp nhất. Các dịch vụ của khoa bao gồm chẩn đoán, quản lý thuốc, và các chương trình giáo dục sức khỏe để giúp bệnh nhân hiểu rõ hơn về bệnh tình của mình. Khoa còn tham gia vào các nghiên cứu để tìm ra các phương pháp điều trị mới và hiệu quả hơn, nhằm cải thiện chất lượng cuộc sống cho bệnh nhân.'),
(N'Khoa Chẩn đoán hình ảnh tim mạch', N'Khoa Chẩn đoán hình ảnh tim mạch sử dụng các kỹ thuật hình ảnh tiên tiến như MRI, CT scan, và siêu âm để chẩn đoán và đánh giá các bệnh lý tim mạch. Khoa này cung cấp những thông tin chi tiết về cấu trúc và chức năng của tim, giúp các bác sĩ đưa ra quyết định điều trị chính xác. Khoa cũng tham gia vào các nghiên cứu để cải tiến kỹ thuật hình ảnh và phát triển các phương pháp chẩn đoán mới, nhằm nâng cao hiệu quả điều trị.'),
(N'Khoa Phục hồi chức năng tim mạch', N'Khoa Phục hồi chức năng tim mạch cung cấp các chương trình tập luyện và phục hồi chức năng cho bệnh nhân sau các can thiệp hoặc phẫu thuật tim mạch. Khoa này giúp bệnh nhân nhanh chóng hồi phục và trở lại cuộc sống bình thường, với các dịch vụ như tư vấn dinh dưỡng, tập luyện thể chất, và hỗ trợ tâm lý. Khoa cũng tổ chức các chương trình giáo dục sức khỏe để bệnh nhân hiểu rõ hơn về cách chăm sóc bản thân và phòng ngừa các biến chứng. Ngoài ra, khoa còn tham gia vào các nghiên cứu để cải tiến quy trình phục hồi và phát triển các phương pháp mới, nhằm mang lại hiệu quả tốt nhất cho bệnh nhân.'),
(N'Khoa Dược lâm sàng tim mạch', N'Khoa Dược lâm sàng tim mạch chuyên về quản lý và sử dụng thuốc trong điều trị các bệnh lý tim mạch. Khoa này đảm bảo rằng bệnh nhân nhận được các loại thuốc phù hợp và liều lượng chính xác, đồng thời giám sát và đánh giá hiệu quả của việc sử dụng thuốc. Các dịch vụ của khoa bao gồm tư vấn về thuốc, quản lý tác dụng phụ, và điều chỉnh liều lượng thuốc theo từng trường hợp cụ thể. Khoa cũng tham gia vào các nghiên cứu về dược lý tim mạch để tìm ra các loại thuốc mới và cải thiện hiệu quả điều trị. Ngoài ra, khoa còn tổ chức các chương trình đào tạo và giáo dục để nâng cao kiến thức và kỹ năng của nhân viên y tế trong việc quản lý và sử dụng thuốc.'),
(N'Khoa Dịch vụ y tế dự phòng tim mạch', N'Khoa Dịch vụ y tế dự phòng tim mạch tập trung vào công tác phòng ngừa các bệnh lý tim mạch thông qua các chương trình giáo dục sức khỏe, tư vấn lối sống lành mạnh, và kiểm tra sức khỏe định kỳ. Khoa này giúp bệnh nhân và cộng đồng hiểu rõ hơn về các yếu tố nguy cơ của bệnh tim mạch và cách phòng ngừa chúng. Các dịch vụ của khoa bao gồm kiểm tra và đánh giá nguy cơ tim mạch, tư vấn về dinh dưỡng và vận động, và các chương trình quản lý stress. Khoa cũng hợp tác với các đơn vị khác trong bệnh viện và cộng đồng để triển khai các chương trình y tế dự phòng hiệu quả, nhằm giảm thiểu tỷ lệ mắc bệnh tim mạch và cải thiện chất lượng cuộc sống cho mọi người.'),
(N'Khoa Dịch vụ chăm sóc tim mạch tại nhà', N'Khoa Dịch vụ chăm sóc tại nhà cung cấp các dịch vụ y tế cho bệnh nhân tim mạch ngay tại nhà của họ, giúp họ tiếp tục nhận được sự chăm sóc và theo dõi sau khi ra viện. Các dịch vụ của khoa bao gồm theo dõi tình trạng sức khỏe, quản lý thuốc, tư vấn dinh dưỡng, và hỗ trợ tập luyện. Khoa cũng cung cấp các dịch vụ hỗ trợ tâm lý và tư vấn cho bệnh nhân và gia đình, giúp họ vượt qua những khó khăn trong quá trình hồi phục. Nhân viên y tế trong khoa luôn đảm bảo rằng bệnh nhân nhận được sự chăm sóc toàn diện và chất lượng cao ngay tại nhà, giúp họ duy trì sức khỏe tốt và nâng cao chất lượng cuộc sống.')
