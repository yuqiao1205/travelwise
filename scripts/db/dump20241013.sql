CREATE DATABASE  IF NOT EXISTS `travelwise` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `travelwise`;
-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: travelwise
-- ------------------------------------------------------
-- Server version	9.0.1

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
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `desc` longtext NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  `parentCommentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `postid_idx` (`postId`),
  KEY `commentUserid_idx` (`userId`),
  CONSTRAINT `parentCommentId` FOREIGN KEY (`id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (40,'i agree you, i like it too','2023-12-30 22:17:58',4,15,39),(41,'nice post i ever seen','2023-12-30 22:18:11',4,15,NULL),(42,'i like this Singapore post id3','2023-12-30 22:36:15',5,3,NULL),(44,'nice SF post','2024-01-02 16:25:12',4,16,NULL),(45,'jjj','2024-01-02 16:43:26',4,15,NULL),(54,'i like this post','2024-01-21 19:06:58',3,63,52),(55,'nice post','2024-01-25 18:22:19',4,63,NULL),(56,'thank you','2024-01-25 18:24:24',3,63,55),(57,'nice','2024-01-27 15:04:34',3,18,NULL),(58,'thank you','2024-01-27 15:05:06',3,18,57),(59,'hihi','2024-01-28 22:02:24',3,63,NULL),(60,'nice i liket','2024-02-15 19:34:59',3,18,57),(61,'i like your post from test11','2024-02-21 12:51:30',3,3,NULL),(62,'thank you.','2024-02-21 12:53:09',4,3,61),(63,'hi','2024-03-15 13:29:26',3,81,NULL),(64,'hi','2024-03-15 13:30:06',3,81,63);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `fid` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`fid`),
  KEY `userId_idx` (`userId`),
  KEY `postId_idx` (`postId`),
  CONSTRAINT `postId_fk` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userId_fk` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=363 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (153,4,16),(171,4,18),(191,4,63),(243,4,17),(254,5,5),(340,6,18),(341,6,12),(348,3,12),(349,3,18),(350,3,13),(354,33,18),(357,3,114),(358,3,115),(359,3,3),(360,37,115),(361,37,114),(362,37,12);
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `likeUserId_idx` (`userId`),
  KEY `likePostId_idx` (`postId`),
  CONSTRAINT `likePostId` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likeUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=356 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (31,5,13),(53,4,12),(68,4,13),(82,5,16),(100,4,17),(102,4,15),(199,4,5),(232,4,16),(241,4,63),(298,3,15),(300,3,16),(309,3,63),(310,3,17),(313,5,5),(315,5,82),(317,6,12),(329,3,5),(334,3,81),(337,3,13),(341,3,18),(342,3,12),(347,3,3),(348,33,114),(349,33,18),(350,33,12),(351,3,115),(352,33,115),(353,37,115),(354,37,114),(355,37,12);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `desc` longtext NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `uid` int NOT NULL,
  `cat` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid_idx` (`uid`),
  CONSTRAINT `uid` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (3,'Singapore Guides Test2--Urban, Family','<p>Singapore is a city where futuristic marvels blend seamlessly with lush greenery, exemplified by the stunning Gardens by the Bay and its iconic Supertree Grove. Its cultural tapestry weaves through bustling neighborhoods like Little India and Chinatown, offering a sensory feast of colors, scents, and flavors. The skyline, dominated by the Marina Bay Sands, reminds one of the city\'s prowess in innovation and luxury, making Singapore a vivid and unforgettable mosaic of modernity and tradition.</p>','1709515375611singapore.jpg','1709515375611singapore.jpg-thumbnail.jpg','2024-03-07 00:00:00',4,'Asia'),(5,'London Trip Post Test11--Urban hiking','<p>In London, history whispers from every corner, from the majestic Tower of London to the Gothic grandeur of Westminster Abbey. The city\'s vibrant energy pulses through its iconic red buses and the bustling streets of Camden Market, offering an eclectic mix of old-world charm and contemporary dynamism. As I strolled along the Thames at sunset, with the iconic London Eye offering panoramic views, I was enveloped in a sense of timeless elegance uniquely characteristic of this cosmopolitan capital.</p>','1709515266941london.jpg','1709515266941london.jpg-thumbnail.jpg','2024-03-06 00:00:00',3,'Europe'),(12,'Africa Adventure Story Test3 -- Nature','<p><span style=\"background-color: rgb(255, 255, 255); color: rgb(36, 36, 36);\">Traveling through Africa is an adventure of a lifetime, offering an unrivaled blend of wildlife, cultural diversity, and natural landscapes. When visiting, it\'s essential to respect local customs and traditions, and always be mindful of conservation efforts, especially in wildlife areas. Safaris are a must-do; the Serengeti in Tanzania and the Maasai Mara in Kenya provide breathtaking opportunities to witness the Great Migration and the Big Five.</span></p>','1709521793849africa.jpg','1709521793849africa.jpg-thumbnail.jpg','2024-03-07 20:20:52',5,'Africa'),(13,'Middle East Post Test2-(Tips&Nature)','<p>The Middle East, a land where ancient history and modernity converge, is a tapestry of diverse cultures and breathtaking landscapes. From the awe-inspiring architectural wonders of Dubai\'s Burj Khalifa to the timeless tranquility of the Dead Sea, the region offers a juxtaposition of the old and the new. The vibrant souks, rich aromas of spices and coffee, and the warm hospitality of its people make the Middle East a captivating and enriching travel experience.</p>','1709515352231middleeast2.jpg','1709515352231middleeast2.jpg-thumbnail.jpg','2024-03-05 20:00:08',4,'Middleeast'),(15,'Updated Shanghai City Post Test11--  Urban','<p>The city\'s culinary scene is a paradise for food lovers, offering everything from delectable street food in Yuyuan Bazaar to upscale dining experiences in Pudong. The cultural richness of Shanghai is evident in its vibrant art scene, exemplified by the contemporary masterpieces at the Power Station of Art. As night falls, the city transforms into a neon spectacle, with the Huangpu River cruise offering unforgettable views of the illuminated cityscape. Shanghai, truly a city that never sleeps, offers an exhilarating mix of history, culture, and modern sophistication that leaves a lasting impression.</p><p>You can do something very special here. There are some good foods such as 排骨年糕。</p>','1709515223928shanghaicity.jpg','1709515223928shanghaicity.jpg-thumbnail.jpg','2024-03-01 20:36:43',3,'Asia'),(16,'Test11--San Francisco Post--Urban,Beaches','<p><span style=\"background-color: rgb(255, 255, 255); color: rgb(77, 81, 86);\">A marvel of modern engineering, the Golden Gate Bridge is&nbsp;</span><span style=\"background-color: rgba(80, 151, 255, 0.18); color: rgb(4, 12, 40);\">1.7 miles long and 90 feet wide</span><span style=\"background-color: rgb(255, 255, 255); color: rgb(77, 81, 86);\">. Its 4,200-foot main span between the two towers was the longest for a suspension bridge until 1964, while its 746-foot towers made it the tallest bridge of any type until 1993.</span></p>','1709515192239sf-beach.jpg','1709515192239sf-beach.jpg-thumbnail.jpg','2024-03-02 21:05:14',3,'America'),(17,'Middle East Tips Test3--Hiking','<p>Always carry a scarf or shawl for visiting religious sites, and be mindful of cultural sensitivities, especially during Ramadan. Public transportation can vary in reliability, so consider hiring a local guide or using ride-hailing apps for ease of travel. Stay hydrated and protect yourself from the sun, as the climate can be extremely hot, particularly in the desert regions. Lastly, don\'t miss the opportunity to explore the local cuisine – from savory shawarmas to sweet baklava, the flavors are as diverse and rich as the culture.&nbsp;</p>','1709514889731middleeast1.jpg','1709514889731middleeast1.jpg-thumbnail.jpg','2024-03-05 20:30:08',5,'Middleeast'),(18,'Caribbean Explorer Test2--Beaches','<p>The Caribbean is a paradise of turquoise waters, white sandy beaches, and vibrant cultures, each island offering its own unique charm. When visiting, immerse yourself in the local culture by enjoying the lively music scenes, from reggae in Jamaica to salsa in Puerto Rico. Don\'t miss the opportunity to explore the region\'s rich history, evident in the colonial architecture of Havana, Cuba, and the historic forts of St. Kitts. The natural beauty of the Caribbean is unparalleled, from the lush rainforests of Dominica to the stunning coral reefs of Belize, perfect for snorkeling and diving enthusiasts.</p>','1709515299852caribean1.jpg','1709515299852caribean1.jpg-thumbnail.jpg','2024-03-07 22:10:20',4,'Caribbean'),(63,'Test11: Stone Lanterns in Japan Nature and Hiking','<p><span style=\"background-color: rgb(255, 255, 255); color: rgb(98, 98, 96);\">Traditional Japanese gardens, or Nihon teien, are to be found in major cities, at temples, shrines, and&nbsp;</span><a href=\"https://www.japanvisitor.com/japan-city-guides/japanese-castles\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(32, 32, 29);\">castles</a><span style=\"background-color: rgb(255, 255, 255); color: rgb(98, 98, 96);\">, and at the homes of the wealthy. </span></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(98, 98, 96);\">﻿Various features crop up repeatedly in Japanese gardens including: an enclosure formed by a hedge, a fence or a wall of traditional materials, within which there will be arrangements of rocks or stones; real or representational water; a bridge or&nbsp;</span><a href=\"https://www.japanvisitor.com/japan-house-home/stepping-stones\" rel=\"noopener noreferrer\" target=\"_blank\" style=\"background-color: rgb(255, 255, 255); color: rgb(32, 32, 29);\">stepping stones</a><span style=\"background-color: rgb(255, 255, 255); color: rgb(98, 98, 96);\">&nbsp;over the water; paths leading to a pavilion or a tea house; and one or more stone lanterns. Stone lanterns, or Ishidourou, serve to add to the balance, harmony, and enduring nature of the garden and have become almost iconic in their significance, and are now popular items even among western gardeners.</span></p>','1710545401967japanstone.jpg','1710545401967japanstone.jpg-thumbnail.jpg','2024-03-06 12:36:41',3,'Asia'),(81,'Test11: Snow in Sapporo: Urban Nature','<p>Hokkaido, the northernmost of Japan\'s main islands, is renowned for its remarkable landscape, wondrous wildlife, and distinct seasons. Yet, it is the winter season that truly brings out the enchanting allure of Hokkaido.&nbsp;</p><p>Winter in Hokkaido is not just a season; it\'s an event, a snowy spectacle, a magical time when the landscapes are wrapped in pristine white, the cities glitter with illuminations, and the slopes beckon the masses with the promise of adventure.&nbsp;</p>','1710531181947snowview.jpg','1710531181947snowview.jpg-thumbnail.jpg','2024-03-07 20:20:43',3,'Asia'),(82,'Test3-America-Alamo Square Pictures in SF-Urban&Family&Tips','<p>Alamo Square, in the heart of San Francisco, is a quintessential urban oasis that captivates visitors with its picturesque beauty and historic charm. The park is famously home to the Painted Ladies, a row of Victorian houses that boast vibrant colors and intricate details, offering a stunning contrast against the modern city skyline. This scenic backdrop is a magnet for photographers and tourists alike, eager to capture the essence of San Francisco\'s architectural elegance. Beyond its visual allure, Alamo Square provides a serene retreat from bustling city life, with lush green spaces perfect for picnics, strolls, and soaking in panoramic city views. Whether you\'re a history enthusiast, architecture admirer, or simply seeking a peaceful spot to unwind, Alamo Square promises an unforgettable urban adventure in the heart of one of America\'s most iconic cities.</p>','1709514844213alamo.jpeg','1709514844213alamo.jpeg-thumbnail.jpg','2024-03-02 20:02:08',5,'America'),(105,'Zebra Travel - Africa - Nature','<p>Zebra Travel offers unforgettable adventures across the breathtaking landscapes of Africa, where travelers can witness the majestic beauty of zebras roaming freely in their natural habitat. With expert guides leading immersive safaris, visitors have the opportunity to observe these iconic striped creatures up close while exploring the diverse ecosystems of the African continent. Zebra Travel provides a once-in-a-lifetime experience, combining thrilling wildlife encounters with the rich cultural heritage and stunning scenery of Africa.</p>','1710530926987af-zebra.jpg','1710530926987af-zebra.jpg-thumbnail.jpg','2024-03-07 17:59:06',3,'Africa'),(114,'France Travel Tips Cultural Etiquette Teste','<p>Cultural Etiquette: When traveling in France, it\'s important to be aware of and respectful towards French cultural norms. For example, greeting people with a \"Bonjour\" (good morning/afternoon) before starting a conversation is considered polite. It\'s also customary to use formal titles like \"Madame\" or \"Monsieur\" when addressing someone unless they invite you to use their first name. Additionally, dining etiquette is important; wait to be seated by the host, keep your hands on the table, and never place your bread upside down on the table. Learning a few basic French phrases can also go a long way in showing respect for the local culture.</p>','1711055434712france1.jpg','1711055434712france1.jpg-thumbnail.jpg','2024-03-21 13:06:18',33,'Europe'),(115,'Caribbean Travel Tips Teste update','<p>When traveling to the Caribbean, it\'s essential to pack light, breathable clothing, sunscreen, and insect repellent to combat the tropical climate. Be sure to carry local currency for easier transactions and embrace the laid-back island lifestyle by trying local cuisine and engaging with the friendly locals. Additionally, plan activities ahead of time, such as snorkeling or hiking, to make the most of your Caribbean adventure.</p>','1711066607099caribbean3.jpg','1711066607099caribbean3.jpg-thumbnail.jpg','2024-03-21 17:15:28',33,'Caribbean'),(116,'SF Travel','<p><span style=\"color: rgb(217, 48, 37);\">San Francisco</span><span style=\"color: rgb(77, 81, 86);\">&nbsp;Dinner Cruises, Brunch Cruises, and More. Book Your Cruise Today! Cruises, Sightseeing Tours, and More.</span></p>','1728799119744cs2.jpg','1728799119744cs2.jpg-thumbnail.jpg','2024-09-16 12:41:19',37,'America');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posttags`
--

DROP TABLE IF EXISTS `posttags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posttags` (
  `pid` int NOT NULL,
  `tid` int NOT NULL,
  PRIMARY KEY (`pid`,`tid`),
  KEY `tid` (`tid`),
  CONSTRAINT `posttags_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `posttags_ibfk_2` FOREIGN KEY (`tid`) REFERENCES `tags` (`tagId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posttags`
--

LOCK TABLES `posttags` WRITE;
/*!40000 ALTER TABLE `posttags` DISABLE KEYS */;
INSERT INTO `posttags` VALUES (13,1),(63,1),(81,1),(82,1),(114,1),(115,1),(16,2),(18,2),(63,2),(81,2),(115,2),(5,3),(17,3),(63,3),(81,3),(105,3),(3,4),(5,4),(15,4),(16,4),(63,4),(81,4),(82,4),(3,5),(82,5),(116,5),(12,6),(13,6),(18,6),(63,6),(81,6),(105,6),(115,6);
/*!40000 ALTER TABLE `posttags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationships`
--

DROP TABLE IF EXISTS `relationships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relationships` (
  `id` int NOT NULL AUTO_INCREMENT,
  `followerUserId` int NOT NULL,
  `followedUserId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `followerUser_idx` (`followerUserId`),
  KEY `followedUser_idx` (`followedUserId`),
  CONSTRAINT `followedUser` FOREIGN KEY (`followedUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `followerUser` FOREIGN KEY (`followerUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=229 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationships`
--

LOCK TABLES `relationships` WRITE;
/*!40000 ALTER TABLE `relationships` DISABLE KEYS */;
INSERT INTO `relationships` VALUES (68,4,5),(153,4,3),(200,5,3),(203,6,5),(221,3,5),(223,3,4),(224,33,4),(227,33,3),(228,3,33);
/*!40000 ALTER TABLE `relationships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (3,'enzopeng1226@gmail.com','2024-01-17 19:55:14'),(6,'mytravelwise2024@gmail.com','2024-01-18 18:38:39');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `tagId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`tagId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'Tips'),(2,'Beaches'),(3,'Hiking'),(4,'Urban'),(5,'Family'),(6,'Nature');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `img` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(64) NOT NULL,
  `nickname` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `fullname` varchar(45) DEFAULT NULL,
  `interest` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (3,'../../profile/1710965321990flower.jpg','loran@1122.com','test11','$2a$10$3/U//TPepUx8AdCRTruykufbBtHwCE1WDjBkluKYqhEXWfc3S3GsC','xixi','Tokyo','Shibaba','reading,cooking'),(4,'../../profile/1703225111733flower.jpeg','test2@11.com','test2','$2a$10$s6zBOJCP4.4/p56VWeiU.eHz9CXSUin49AvxBo0Fdzlbgn4AcZWLi','lolo','UK','Tom','cooking'),(5,'../../profile/1709440704104yellowbunny.jpeg','lauren@gmail.com','test3','$2a$10$1yp37qVvYlsgEh.naPoW8OR/dPFcC9qnMHK.2DrOYNiUzt0qLbLOW','coco','Tokyo','Yuki',NULL),(6,'../../profile/1709772327974af-zebra.jpg','Loran1226@gmail.com','testb','$2a$10$W3aW55bCWJEfVYDMjIk6SOIKzuG13NVm9vZ7NjNLPVjlJd7h1LGCq','micky','Aichi','Nancy','reading'),(32,NULL,'ddd@gmail.com','testd','$2a$10$I4hL.4ttpUwreBXRDKMTXuSv2qJep7LLJuZss51R/4/tDrVm5BBLa','didi','UK','Tom','listen music, hiking'),(33,'../../profile/1711052074524tree.jpg','ee1e2@gmail.com','teste','$2a$10$JNrUi2Pg/Nad1jCVIT2tVup8HuHt1PwseHbU/i7G8Ba/nc6WMBLxy','testeee','UK','John Teste','reading, traveling '),(34,NULL,'c@gmail.com','testc','$2a$10$Ab8c8rD8YKEUmbDYqJZKbevhdTaogqENnTEYnD6Ivdqyvx3NwFYWW','cici',NULL,NULL,NULL),(36,NULL,'aa@gmail.com','testa','$2a$10$bmOo7OhINHdHcx1QTdgpR.Vc37bKnq9XR0m.0iZYp1fUsBFMhk4.a','aa',NULL,NULL,NULL),(37,'../../profile/1728799015257art2.jpg','loran@gmail.com','yanpeng','$2a$10$iwnGUsgljG2SRU2O0hDqCO3aM.Q5rclKpF.IuclBv2.9PumbLiYLa','yuki','San Francisco','','reading, traveling ');
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

-- Dump completed on 2024-10-13  0:25:00
