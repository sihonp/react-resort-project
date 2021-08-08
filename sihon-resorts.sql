-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: sihon-resorts
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `follow` (
  `userId` int NOT NULL,
  `resortId` int NOT NULL,
  KEY `USER_userId` (`userId`),
  KEY `RESORT_resortId` (`resortId`) /*!80000 INVISIBLE */,
  CONSTRAINT `RESORT_resortId_fk` FOREIGN KEY (`resortId`) REFERENCES `resorts` (`resortId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `USER_userId_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
INSERT INTO `follow` VALUES (4,171),(4,210);
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resorts`
--

DROP TABLE IF EXISTS `resorts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resorts` (
  `resortId` int NOT NULL AUTO_INCREMENT,
  `resortImg` varchar(45) DEFAULT NULL,
  `resortName` varchar(45) DEFAULT NULL,
  `resortPrice` int DEFAULT NULL,
  `resortInfo` varchar(245) DEFAULT NULL,
  `resortStartDate` date DEFAULT NULL,
  `resortEndDate` date DEFAULT NULL,
  PRIMARY KEY (`resortId`)
) ENGINE=InnoDB AUTO_INCREMENT=248 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resorts`
--

LOCK TABLES `resorts` WRITE;
/*!40000 ALTER TABLE `resorts` DISABLE KEYS */;
INSERT INTO `resorts` VALUES (171,'e68ae7a9-9757-43e4-8e68-aa6a4389a24e.jpg','Ko Phi Phi',500,'The Phi Phi Islands are an island group in Thailand between the large island of Phuket and the Straits of Malacca coast of Thailand. The islands are administratively part of Krabi Province.','2020-11-30','2020-12-08'),(182,'30c3bde0-15ac-4b95-9839-5aa8ddcebc9e.jpg','Tel Aviv',480,'Tel Aviv, a city on Israel’s Mediterranean coast, is marked by stark 1930s Bauhaus buildings, thousands of which are clustered in the White City architectural area. Museums include Beit Hatfutsot, whose multimedia..','2020-11-17','2020-12-16'),(183,'e510b71f-fc42-4315-8218-e1a2cd3bd617.jpg','Brazil',345,'Brazil, officially the Federative Republic of Brazil, is the largest country in both South America and Latin America. At 8.5 million square kilometers and with over 211 million people, Brazil is the world\'s...','2020-11-13','2020-11-23'),(210,'92b21684-7dfd-4a18-ad02-acd39b861d2d.jpg','Cancún',560,'Cancún, a Mexican city on the Yucatán Peninsula bordering the Caribbean Sea, is known for its beaches, numerous resorts and nightlife. It’s composed of 2 distinct areas: the more traditional downtown area....','2020-12-02','2020-12-29'),(211,'57b9a57e-4bc2-4ae9-a7a5-6ea17c6e7463.jpg','Miami',450,'Miami, officially the City of Miami, is a metropolis located in southeastern Florida in the United States. It is the third most populous metropolis on the East coast of the United States, and it is the seventh..','2020-12-11','2020-12-31'),(212,'585ec529-4cdb-422b-ac39-baf4c748a228.jpg','Ibiza',670,'Ibiza Town is the capital of Ibiza, one of Spain\'s Balearic Islands in the Mediterranean Sea. It\'s known for its lively nightlife scene, and many European nightclubs have summer outposts here. South of the center..','2020-12-07','2020-12-29'),(213,'915bd2cd-21c7-4b4c-997e-1ac9005498fc.jpg','Maldives',230,'Maldives, officially the Republic of Maldives, is a small archipelagic island country in South Asia, situated in the Arabian Sea of the Indian Ocean. It lies southwest of Sri Lanka and India, about 700 kilometres..','2020-12-16','2020-12-29'),(214,'fa80fe4e-ca46-4d05-9e93-f160d920f178.jpg','Aogashima',1200,'Aogashima is a volcanic Japanese island in the Philippine Sea. The island is administered by Tokyo and is approximately 358 kilometres south of Tokyo and 64 kilometres south of Hachijō-jima. It is the southernmost..','2020-12-19','2021-01-08');
/*!40000 ALTER TABLE `resorts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `userName` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `userType` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'sihon','pakado','sihon24','145b6b00aa041cf0ace0ae93727864f9','sihon@mail.com','Admin'),(2,'mike','tyson','mike12','145b6b00aa041cf0ace0ae93727864f9','mike@mail.com','Client'),(3,'milton','lerner','milton12','145b6b00aa041cf0ace0ae93727864f9','milton@mail.com','Client'),(4,'misha','mish','misha12','adbeb82538c28a505260799845ba76a2','misha@mail.com','Client'),(80,'test','test','test1234','145b6b00aa041cf0ace0ae93727864f9','test1212@mail.com','Client');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-15 19:30:30
