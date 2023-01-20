-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 20, 2023 at 05:27 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ts_org`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `ID` varchar(38) NOT NULL,
  `ClientName` varchar(200) NOT NULL,
  `CntrRplcMMnth` smallint(6) DEFAULT NULL,
  `EmailID` varchar(50) NOT NULL,
  `AppBaseLink` varchar(500) NOT NULL,
  `LogoImage` varchar(500) DEFAULT NULL,
  `TimeZone` varchar(10) NOT NULL,
  `HrsPerDay` smallint(5) UNSIGNED NOT NULL,
  `NoOfWrkDay` smallint(5) UNSIGNED NOT NULL,
  `RplcBudgetAllowed` smallint(5) UNSIGNED NOT NULL,
  `FirstAsmntMonths` smallint(5) UNSIGNED NOT NULL,
  `AssessReminderDueDay` smallint(5) UNSIGNED NOT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`ID`, `ClientName`, `CntrRplcMMnth`, `EmailID`, `AppBaseLink`, `LogoImage`, `TimeZone`, `HrsPerDay`, `NoOfWrkDay`, `RplcBudgetAllowed`, `FirstAsmntMonths`, `AssessReminderDueDay`, `Active`) VALUES
('577eccfd-8d8b-11ed-9b56-30c9aba679c4', 'Client3', NULL, 'aa@gmail.com', 'https://www.aa.com/c3', NULL, 'IST', 3, 5, 5, 6, 7, 1),
('8c19bc58-8ccb-11ed-b98c-30c9aba679c4', 'Client2', 2, 'aab@gmail.com', 'https://www.aa.com/c2', 'ssh', 'GMT', 2, 2, 3, 3, 3, 0),
('917a3ad0-8d8b-11ed-9b56-30c9aba679c4', 'Client4', NULL, 'aac@gmail.com', 'https://www.aa.com/c4', NULL, 'IST', 3, 1, 6, 5, 7, 1),
('94e62b76-8d8b-11ed-9b56-30c9aba679c4', 'Client5', NULL, 'aad@gmail.com', 'https://www.aa.com/c5', NULL, 'IST', 3, 1, 6, 5, 7, 0),
('97a708a0-8d8b-11ed-9b56-30c9aba679c4', 'Client6', NULL, 'aae@gmail.com', 'https://www.aa.com/c6', NULL, 'IST', 3, 1, 6, 5, 7, 0),
('9a0c43ac-8d8b-11ed-9b56-30c9aba679c4', 'Client7', NULL, 'aaf@gmail.com', 'https://www.aa.com/c7', NULL, 'IST', 3, 1, 6, 5, 7, 0),
('9c37a75b-8d8b-11ed-9b56-30c9aba679c4', 'Client8', NULL, 'aag@gmail.com', 'https://www.aa.com/c8', NULL, 'IST', 3, 1, 6, 5, 7, 0),
('a7d52580-90c6-11ed-89c9-30c9aba679c4', 'Client9', 66, 'aa9@gmail.com', 'https://www.aa.com/c9', NULL, 'GMT', 8, 5, 2, 1, 9, 1),
('c8f21967-930a-11ed-a3c5-30c9aba679c4', 'Iamclient', 4, 'iamclient@gmail.com', 'https://www.client.app', 'Imagee', 'IST', 8, 5, 9, 7, 6, 1),
('ff7dd1ff-8cc1-11ed-b98c-30c9aba679c4', 'Client1', NULL, 'aah@gmail.com', 'https://www.aa.com/c1', NULL, 'IST', 2, 22, 2, 2, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `email_templates`
--

CREATE TABLE `email_templates` (
  `ID` varchar(38) NOT NULL,
  `Name` varchar(20) NOT NULL,
  `CreateDate` datetime NOT NULL,
  `Content` varchar(2000) DEFAULT NULL,
  `Subject` varchar(500) DEFAULT NULL,
  `NotificationType` varchar(20) NOT NULL,
  `EventType` varchar(20) NOT NULL,
  `OrganizationID` varchar(38) NOT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_templates`
--

INSERT INTO `email_templates` (`ID`, `Name`, `CreateDate`, `Content`, `Subject`, `NotificationType`, `EventType`, `OrganizationID`, `Active`) VALUES
('206cbdf5-97bb-11ed-b8b6-30c9aba679c4', 'Temp4', '2023-01-16 11:05:00', 'Hello', 'Test', 'Email', 'CREATEPOS', '9c37a75b-8d8b-11ed-9b56-30c9aba679c4', 1),
('5fb5c3db-9631-11ed-8ab2-30c9aba679c4', 'Temp2', '2023-01-06 16:11:00', 'Hello', 's', 'Email', 'UPDATEPOS', '94e62b76-8d8b-11ed-9b56-30c9aba679c4', 1),
('649f1bb3-9631-11ed-8ab2-30c9aba679c4', 'Temp3', '2023-01-06 16:11:00', 'Hello', 's', 'Email', 'UPDATEPOS', 'a7d52580-90c6-11ed-89c9-30c9aba679c4', 0),
('6a4059fa-9631-11ed-8ab2-30c9aba679c4', 'Temp5', '2023-01-06 16:11:00', 'Hello', 's', 'Email', 'UPDATEPOS', '97a708a0-8d8b-11ed-9b56-30c9aba679c4', 1),
('e800a6df-9627-11ed-8ab2-30c9aba679c4', 'Temp1', '2023-01-02 10:55:00', 'Hello World', 'Test', 'Teams', 'CREATEPOS', '94e62b76-8d8b-11ed-9b56-30c9aba679c4', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `ID` (`ID`),
  ADD UNIQUE KEY `ClientName` (`ClientName`),
  ADD UNIQUE KEY `EmailID` (`EmailID`),
  ADD UNIQUE KEY `AppBaseLink` (`AppBaseLink`);

--
-- Indexes for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `OrganizationID` (`OrganizationID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `email_templates`
--
ALTER TABLE `email_templates`
  ADD CONSTRAINT `email_templates_ibfk_1` FOREIGN KEY (`OrganizationID`) REFERENCES `customers` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
