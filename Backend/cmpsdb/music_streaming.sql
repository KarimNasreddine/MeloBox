-- MySQL dump 10.13  Distrib 8.0.30, for macos12 (x86_64)
--
-- Host: localhost    Database: music_streaming
-- ------------------------------------------------------
-- Server version	8.0.30

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
-- Table structure for table `album`
--

DROP TABLE IF EXISTS `album`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `album` (
  `album_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `release_date` date NOT NULL,
  `artist_id` int NOT NULL,
  PRIMARY KEY (`album_id`),
  KEY `artist_id` (`artist_id`),
  KEY `album_index` (`album_id`),
  CONSTRAINT `album_ibfk_1` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`artist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `album`
--

LOCK TABLES `album` WRITE;
/*!40000 ALTER TABLE `album` DISABLE KEYS */;
INSERT INTO `album` VALUES (1,'Unity','2023-09-20',1);
/*!40000 ALTER TABLE `album` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `album_view`
--

DROP TABLE IF EXISTS `album_view`;
/*!50001 DROP VIEW IF EXISTS `album_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `album_view` AS SELECT 
 1 AS `album_id`,
 1 AS `album_name`,
 1 AS `release_date`,
 1 AS `artist_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `artist`
--

DROP TABLE IF EXISTS `artist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `artist` (
  `artist_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `popularity_score` int NOT NULL,
  `genre_id` int DEFAULT NULL,
  PRIMARY KEY (`artist_id`),
  KEY `fk_genre` (`genre_id`),
  KEY `artist_index` (`artist_id`),
  CONSTRAINT `fk_genre` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `artist`
--

LOCK TABLES `artist` WRITE;
/*!40000 ALTER TABLE `artist` DISABLE KEYS */;
INSERT INTO `artist` VALUES (1,'Yubik',100,1),(2,'Massano',200,1),(3,'Anyma',500,1);
/*!40000 ALTER TABLE `artist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `artist_view`
--

DROP TABLE IF EXISTS `artist_view`;
/*!50001 DROP VIEW IF EXISTS `artist_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `artist_view` AS SELECT 
 1 AS `artist_id`,
 1 AS `artist_name`,
 1 AS `popularity_score`,
 1 AS `genre_id`,
 1 AS `album_name`,
 1 AS `release_date`,
 1 AS `album_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `genre_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  PRIMARY KEY (`genre_id`),
  KEY `genre_index` (`genre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT INTO `genre` VALUES (1,'Techno','Electronic Music');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `genre_view`
--

DROP TABLE IF EXISTS `genre_view`;
/*!50001 DROP VIEW IF EXISTS `genre_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `genre_view` AS SELECT 
 1 AS `genre_id`,
 1 AS `genre_name`,
 1 AS `description`,
 1 AS `artist_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `playlist`
--

DROP TABLE IF EXISTS `playlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playlist` (
  `playlist_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `user_id` int NOT NULL,
  PRIMARY KEY (`playlist_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `playlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlist`
--

LOCK TABLES `playlist` WRITE;
/*!40000 ALTER TABLE `playlist` DISABLE KEYS */;
INSERT INTO `playlist` VALUES (1,'Playlist 2','Techno',1),(2,'tech','tech',1),(3,'house','house',2);
/*!40000 ALTER TABLE `playlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `playlist_view`
--

DROP TABLE IF EXISTS `playlist_view`;
/*!50001 DROP VIEW IF EXISTS `playlist_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `playlist_view` AS SELECT 
 1 AS `playlist_id`,
 1 AS `playlist_name`,
 1 AS `track_title`,
 1 AS `duration`,
 1 AS `album_name`,
 1 AS `artist_name`,
 1 AS `genre_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `track`
--

DROP TABLE IF EXISTS `track`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `track` (
  `track_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `duration` int NOT NULL,
  `album_id` int NOT NULL,
  `genre_id` int NOT NULL,
  `artist_id` int NOT NULL,
  PRIMARY KEY (`track_id`),
  KEY `album_id` (`album_id`),
  KEY `genre_id` (`genre_id`),
  KEY `artist_id` (`artist_id`),
  KEY `track_index` (`track_id`),
  CONSTRAINT `track_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `album` (`album_id`),
  CONSTRAINT `track_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`),
  CONSTRAINT `track_ibfk_3` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`artist_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `track`
--

LOCK TABLES `track` WRITE;
/*!40000 ALTER TABLE `track` DISABLE KEYS */;
INSERT INTO `track` VALUES (1,'Runner',200,1,1,1),(2,'System',100,1,1,2);
/*!40000 ALTER TABLE `track` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `track_playlist`
--

DROP TABLE IF EXISTS `track_playlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `track_playlist` (
  `playlist_id` int NOT NULL,
  `track_id` int NOT NULL,
  PRIMARY KEY (`playlist_id`,`track_id`),
  KEY `track_id` (`track_id`),
  KEY `playlist_track_index` (`playlist_id`,`track_id`),
  CONSTRAINT `track_playlist_ibfk_1` FOREIGN KEY (`playlist_id`) REFERENCES `playlist` (`playlist_id`),
  CONSTRAINT `track_playlist_ibfk_2` FOREIGN KEY (`track_id`) REFERENCES `track` (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `track_playlist`
--

LOCK TABLES `track_playlist` WRITE;
/*!40000 ALTER TABLE `track_playlist` DISABLE KEYS */;
INSERT INTO `track_playlist` VALUES (1,1),(2,1),(1,2);
/*!40000 ALTER TABLE `track_playlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `track_view`
--

DROP TABLE IF EXISTS `track_view`;
/*!50001 DROP VIEW IF EXISTS `track_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `track_view` AS SELECT 
 1 AS `track_id`,
 1 AS `track_name`,
 1 AS `duration`,
 1 AS `album`,
 1 AS `genre`,
 1 AS `artist`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `subscription_status` tinyint(1) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `email_index` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'John','Doe','123','123',1,1),(2,'x','y','345','123',1,0),(3,'John','Doe','johndoe.com','123',1,0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `album_view`
--

/*!50001 DROP VIEW IF EXISTS `album_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `album_view` AS select `album`.`album_id` AS `album_id`,`album`.`name` AS `album_name`,`album`.`release_date` AS `release_date`,`artist`.`name` AS `artist_name` from (`album` join `artist` on((`album`.`artist_id` = `artist`.`artist_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `artist_view`
--

/*!50001 DROP VIEW IF EXISTS `artist_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `artist_view` AS select `artist`.`artist_id` AS `artist_id`,`artist`.`name` AS `artist_name`,`artist`.`popularity_score` AS `popularity_score`,`artist`.`genre_id` AS `genre_id`,`album`.`name` AS `album_name`,`album`.`release_date` AS `release_date`,`album`.`album_id` AS `album_id` from (`album` join `artist` on((`album`.`artist_id` = `artist`.`artist_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `genre_view`
--

/*!50001 DROP VIEW IF EXISTS `genre_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `genre_view` AS select `genre`.`genre_id` AS `genre_id`,`genre`.`name` AS `genre_name`,`genre`.`description` AS `description`,`artist`.`name` AS `artist_name` from (`genre` join `artist` on((`genre`.`genre_id` = `artist`.`genre_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `playlist_view`
--

/*!50001 DROP VIEW IF EXISTS `playlist_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `playlist_view` AS select `playlist`.`playlist_id` AS `playlist_id`,`playlist`.`name` AS `playlist_name`,`track`.`title` AS `track_title`,`track`.`duration` AS `duration`,`album`.`name` AS `album_name`,`artist`.`name` AS `artist_name`,`genre`.`name` AS `genre_name` from (((((`playlist` join `track_playlist` on((`playlist`.`playlist_id` = `track_playlist`.`playlist_id`))) join `track` on((`track_playlist`.`track_id` = `track`.`track_id`))) join `album` on((`track`.`album_id` = `album`.`album_id`))) join `artist` on((`track`.`artist_id` = `artist`.`artist_id`))) join `genre` on((`track`.`genre_id` = `genre`.`genre_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `track_view`
--

/*!50001 DROP VIEW IF EXISTS `track_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `track_view` AS select `track`.`track_id` AS `track_id`,`track`.`title` AS `track_name`,`track`.`duration` AS `duration`,`album`.`name` AS `album`,`genre`.`name` AS `genre`,`artist`.`name` AS `artist` from (((`track` join `artist` on((`track`.`artist_id` = `artist`.`artist_id`))) join `album` on((`track`.`album_id` = `album`.`artist_id`))) join `genre` on((`track`.`genre_id` = `genre`.`genre_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-11 21:21:14
