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
	IDBacSi varchar(6) unique not null,
	CONSTRAINT CK_IDBacSi_Format CHECK (IDBacSi LIKE 'BS[0-9][0-9][0-9]'),
	hoten nvarchar(50) not null,
	--[password] varchar(30) not null,
	namSinh int not null,
	SDT int not null,
	gioiTinh nvarchar(10) not null ,
	email varchar(30) not null,
	HocVan nvarchar(40) not null,
	Sonamcongtac int not null,

	CONSTRAINT PK_BacSi PRIMARY KEY (IDBacSi)
);


create table BenhNhan(
	IDBenhNhan varchar(6) unique not null,
	CONSTRAINT CK_IDBenhNhan_Format CHECK (IDBenhNhan LIKE 'BN[0-9][0-9][0-9]'),
	hoten nvarchar(50) not null,
	username varchar(50) not null,
	password varchar(30) not null,
	namSinh int not null,
	diaChi nvarchar(50),
	SDT int not null ,
	gioiTinh varchar(10) not null,
	email varchar(30),
	
	CONSTRAINT PK_BenhNhan PRIMARY KEY (IDBenhNhan),
	UNIQUE([username], [password])
);

create table CaKham(
	IDCa int identity(1,1) NOT NULL,
	KhungGio varchar(20) NOT NULL,

	CONSTRAINT PK_CaKham PRIMARY KEY (IDCa)
);

create table Khoa(
	IDKhoa int identity(1,1) NOT NULL,
	TenKhoa nvarchar(50) not null,
	SoLuongBacSi int not null default 0, -- cần tạo trigger

	CONSTRAINT PK_Khoa PRIMARY KEY (IDKhoa) 

);

create table BacsiKhoa(
	IDBacSi varchar(6) not null,
	IDKhoa int not null, -- cần tạo trigger

	CONSTRAINT PK_BacSiKhoa PRIMARY KEY (IDKhoa,IDBacSi),
	UNIQUE(IDKhoa, IDBacSi),
	CONSTRAINT FK_BacSiKhoa1 FOREIGN KEY (IDBacSi) REFERENCES BacSi(IDBacSi),
	CONSTRAINT FK_BacSiKhoa2 FOREIGN KEY (IDKhoa) REFERENCES Khoa(IDKhoa)
);


CREATE TABLE LichLamViec (
    IDLich INT IDENTITY(1,1) ,
    IDBacSi varchar(6) not null,
	IDKhoa int not null,
    IDCa INT not null,
    Thu INT NOT NULL,
	CONSTRAINT CK_YourIntColumn CHECK (Thu >= 2 AND Thu <= 7),
    [soLuong] INT NOT NULL,

	CONSTRAINT PK_LichLamViec PRIMARY KEY (IDLich),
	CONSTRAINT FK_LichLamViec1 FOREIGN KEY (IDBacSi) REFERENCES BacSi([IDBacSi]),
	CONSTRAINT FK_LichLamViec2 FOREIGN KEY (IDKhoa) REFERENCES Khoa(IDKhoa),
	CONSTRAINT FK_LichLamViec3 FOREIGN KEY (IDCa) REFERENCES CaKham(IDCa)
);

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
	IDLich int identity(1,1), 
	IDCa INT not null,
	IDBenhNhan varchar(6) not null,
	IDBacSi varchar(6) not null,
	IDDichVu int not null,
	ThuDatLich int, -- cần tạo trigger
	NgayDatLich date not null default getdate(),
	TrangThai int not null default 1,
	CONSTRAINT CK_TrangThai CHECK (TrangThai IN (0, 1)),
	TinhTrangThanhToan int not null default 0,
	CONSTRAINT CK_TinhTrangThanhToan CHECK (TinhTrangThanhToan IN (0, 1)),
	
	CONSTRAINT PK_Lich_Dat PRIMARY KEY (IDLich),
	CONSTRAINT FK_Lich_Dat1 FOREIGN KEY (IDCa) REFERENCES CaKham(IDCa),
	CONSTRAINT FK_Lich_Dat2 FOREIGN KEY (IDBacSi) REFERENCES BacSi(IDBacSi),
	CONSTRAINT FK_Lich_Dat3 FOREIGN KEY (IDBenhNhan) REFERENCES BenhNhan(IDBenhNhan),
	CONSTRAINT FK_Lich_Dat4 FOREIGN KEY (IDDichVu) REFERENCES DichVu(IDDichVu)
);


CREATE TABLE LichNghi(
	IDLichNghi int identity(1,1), 
	IDCa INT not null,
	IDBacSi varchar(6) not null,
	NgayNghi date not null default getdate(),
	
	CONSTRAINT PK_LichNghi PRIMARY KEY (IDLichNghi),
	CONSTRAINT FK_LichNghi1 FOREIGN KEY (IDCa) REFERENCES CaKham(IDCa),
	CONSTRAINT FK_LichNghi2 FOREIGN KEY (IDBacSi) REFERENCES BacSi(IDBacSi),

);
