-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 19 mai 2024 à 08:21
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ecf-new`
--

-- --------------------------------------------------------

--
-- Structure de la table `alimentation`
--

CREATE TABLE `alimentation` (
  `alimentation_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `heure` time NOT NULL,
  `nourriture` varchar(50) NOT NULL,
  `quantite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `alimentation`
--

INSERT INTO `alimentation` (`alimentation_id`, `date`, `heure`, `nourriture`, `quantite`) VALUES
(1, '0000-00-00', '00:00:00', 'viade', 2),
(2, '0000-00-00', '00:00:00', 'Légumes frais', 2),
(3, '0000-00-00', '00:00:00', 'viande', 2),
(4, '0000-00-00', '00:00:00', 'Graine de tournesol ', 1),
(5, '0000-00-00', '00:00:00', 'Graines de tournesol', 1),
(6, '0000-00-00', '00:00:00', 'viande', 2),
(7, '0000-00-00', '00:00:00', 'Fruits frais', 1),
(8, '0000-00-00', '00:00:00', 'Légumes frais', 1),
(9, '0000-00-00', '00:00:00', 'Fruits frais', 3),
(10, '0000-00-00', '00:00:00', 'Légumes frais', 2),
(11, '0000-00-00', '00:00:00', 'viande', 2),
(12, '0000-00-00', '00:00:00', 'Poisson', 1),
(13, '0000-00-00', '00:00:00', 'Graines de tournesol', 1),
(14, '0000-00-00', '00:00:00', 'Légumes frais', 1),
(15, '0000-00-00', '00:00:00', 'Poisson', 2);

-- --------------------------------------------------------

--
-- Structure de la table `animal`
--

CREATE TABLE `animal` (
  `animal_id` int(11) NOT NULL,
  `etat` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `habitat_id` int(11) NOT NULL,
  `abel` varchar(50) NOT NULL,
  `alimentation_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `animal`
--

INSERT INTO `animal` (`animal_id`, `etat`, `prenom`, `habitat_id`, `abel`, `alimentation_id`) VALUES
(1, 'en forme', 'Tigrou', 1, 'Tigre', 1),
(2, 'en forme', 'Gogo', 1, 'Gorille', 2),
(3, 'en forme', 'Jaco', 1, 'Jaguar', 3),
(4, 'en forme', 'Paco', 1, 'Singe Capucin', 4),
(5, 'en forme', 'Moche', 1, 'Tapir', 5),
(6, 'en forme', 'Simba', 2, 'Lion', 6),
(7, 'en forme', 'Girou', 2, 'Girafe', 7),
(8, 'en forme', 'Gaga', 2, 'Gnou', 8),
(9, 'en forme', 'Boubou', 2, 'Eléphant d\'Afrique', 9),
(10, 'en forme', 'Raya', 3, 'Zèbre', 10),
(11, 'en forme', 'Croko', 3, 'Alligator', 11),
(12, 'en forme', 'Jezo', 3, 'Héron', 12),
(13, 'en forme', 'Raph', 3, 'Tortue de Floride', 13),
(14, 'en forme', 'Gabs', 3, 'Castor', 14),
(15, 'en forme', 'Bule', 3, 'Lamantin', 15),
(16, 'Diminuer sa nourriture', 'Perlo', 1, 'piton', 0);

-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

CREATE TABLE `avis` (
  `avis_id` int(11) NOT NULL,
  `commentaire` text NOT NULL,
  `pseudo` varchar(50) NOT NULL,
  `validation` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `habitat`
--

CREATE TABLE `habitat` (
  `habitat_id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `commentaire_habitat` varchar(50) NOT NULL,
  `besoin_amelioration` tinyint(1) DEFAULT NULL,
  `image_habitat` text NOT NULL,
  `etat_habitat` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `habitat`
--

INSERT INTO `habitat` (`habitat_id`, `nom`, `description`, `commentaire_habitat`, `besoin_amelioration`, `image_habitat`, `etat_habitat`) VALUES
(1, 'jungle', 'L\'habitat de la jungle du zoo Arcadia recrée une forêt tropicale dense, abritant des jaguars, des singes et des oiseaux colorés. Les visiteurs y découvrent un environnement verdoyant et immersif.', 'tailler les arbres ', NULL, 'https://static.wikia.nocookie.net/ficspecies/images/4/47/Jungle.jpg/revision/latest/scale-to-width-down/1200?cb=20190820221420', 'bonne etat'),
(2, 'savane', 'L\'habitat de la savane au zoo Arcadia simule les vastes plaines africaines, hébergeant des lions, des girafes et des éléphants. Les visiteurs y observent la faune dans un cadre naturel et ouvert.', 'Vérifier l\'enclos du Zèbre', NULL, 'https://www.conservation-nature.fr/wp-content/uploads/2020/10/savane-1.jpg', 'bonne état'),
(3, 'marais', 'L\'habitat des marais au zoo Arcadia recrée un environnement humide avec des étangs et des végétations denses. Il abrite des alligators, des tortues et des oiseaux aquatiques.', 'mettre plus de gravier pour les petits sentiers', NULL, 'https://c.pxhere.com/photos/f4/87/minnesota_footbridge_forest_trees_sky_plants_grass_water-1126515.jpg!s2', '');

-- --------------------------------------------------------

--
-- Structure de la table `image`
--

CREATE TABLE `image` (
  `image_id` int(11) NOT NULL,
  `image_animal` text NOT NULL,
  `race_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `image`
--

INSERT INTO `image` (`image_id`, `image_animal`, `race_id`) VALUES
(1, 'https://img.freepik.com/photos-premium/tigre-siberie-marchant-dans-rue_495907-598.jpg', 1),
(2, 'https://www.my-wildlife.com/wp-content/uploads/2022/04/gorille-des-montagnes-mgahinga-GregoryRohart-10-775x517.jpg', 2),
(3, 'https://th-thumbnailer.cdn-si-edu.com/d4DsfrfcLn9LXj51bAm3mTgGh0I=/800x450/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/Jaguars-female-walking-631.jpg', 3),
(4, 'https://st2.depositphotos.com/4201529/6199/i/450/depositphotos_61991201-stock-photo-capuchin-monkey.jpg', 4),
(5, 'https://media.istockphoto.com/id/1188017598/fr/photo/tapir-sud-am%C3%A9ricain-marchant-dans-lherbe.jpg?s=612x612&w=0&k=20&c=KZhxavuI9z6xLga44B0l2nbz4qGXrOOZQyEf--CY65M=', 5),
(6, 'https://st.focusedcollection.com/13735766/i/650/focused_164925358-stock-photo-male-lion-walking.jpg', 6),
(7, 'https://www.photos-animaux.com/data/photos/619/6182/618195.jpg', 7),
(8, 'https://www.pairidaiza.eu/sites/default/files/styles/poi_banner/public/media/image/Gnou-HEADERR.jpg?h=5bf672e5&itok=F4BQgDjT', 8),
(9, 'https://st2.depositphotos.com/1402744/9863/i/450/depositphotos_98634060-stock-photo-elephant-in-the-savannah.jpg', 9),
(10, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Equus_quagga_burchellii_-_Etosha%2C_2014.jpg/800px-Equus_quagga_burchellii_-_Etosha%2C_2014.jpg', 10),
(11, 'https://media.istockphoto.com/id/1441579634/photo/closeup-shot-of-a-dangerous-crocodile.jpg?s=612x612&w=0&k=20&c=U01PA_1CO60Gce-JM48WqyN4M2Q6J0Xl_OUakz6264w=', 11),
(12, 'https://st2.depositphotos.com/7508786/10651/i/450/depositphotos_106512060-stock-photo-grey-heron-standing-in-the.jpg', 12),
(13, 'https://doriscdn.ffessm.fr/var/doris/storage/images/images/les-griffes-26978/228833-1-fre-FR/trachemys_scripta_ml31_image1200.jpg', 13),
(14, 'https://media.istockphoto.com/id/175602763/fr/photo/longue-de-beaver.jpg?s=612x612&w=0&k=20&c=Q7H3Gnc4eT61nL8onMtCB-XyeoDlFC-yjp0QYRJ4RKI=', 14),
(15, 'https://lespetitsaventuriers.com/wp-content/uploads/tete-de-lamantin.jpg', 15);

-- --------------------------------------------------------

--
-- Structure de la table `rapport_veterinaire`
--

CREATE TABLE `rapport_veterinaire` (
  `rapport_veterinaire_id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `alimentation_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `crveto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `rapport_veterinaire`
--

INSERT INTO `rapport_veterinaire` (`rapport_veterinaire_id`, `animal_id`, `alimentation_id`, `username`, `crveto`) VALUES
(1, 1, 1, '', 'bonne santé'),
(2, 2, 2, '', 'bonne santé'),
(3, 3, 3, '', 'bonne santé'),
(4, 4, 4, '', 'bonne santé'),
(5, 5, 5, '', 'bonne santé'),
(6, 6, 6, '', 'bonne santé'),
(7, 7, 7, '', 'bonne santé'),
(8, 8, 8, '', 'bonne santé'),
(9, 9, 9, '', 'bonne santé'),
(10, 10, 10, '', 'bonne santé'),
(11, 11, 11, '', 'bonne santé'),
(12, 12, 12, '', 'bonne santé'),
(13, 13, 13, '', 'bonne santé'),
(14, 14, 14, '', 'bonne santé'),
(15, 15, 15, '', 'bonne santé');

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `role`
--

INSERT INTO `role` (`role_id`, `label`) VALUES
(1, 'administrateur'),
(2, 'emploé'),
(3, 'vétérinaire');

-- --------------------------------------------------------

--
-- Structure de la table `service`
--

CREATE TABLE `service` (
  `service_id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `image_service` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `service`
--

INSERT INTO `service` (`service_id`, `nom`, `description`, `image_service`) VALUES
(1, 'Restaurant', 'Le restaurant du zoo Arcadia offre une vue panoramique sur les habitats environnants. Il propose une variété de plats locaux et internationaux, adaptés à tous les âges et préférences alimentaires. Les visiteurs peuvent se détendre et savourer leur repas d', 'https://cdn-images.zoobeauval.com/_IuJhBGgQkKMthxuWh3bR7Ga5YE=/1600x950/https%3A%2F%2Fs3.eu-west-3.amazonaws.com%2Fimages.zoobeauval.com%2F2020%2F05%2F01-ap911395-1-header-5ec4dbb3bdbb9.jpg'),
(2, 'Visite des habitats avec un guide', 'La visite guidée au zoo Arcadia offre une immersion enrichissante, où des experts partagent des informations fascinantes sur les animaux et leurs comportements. Les guides fournissent des anecdotes, enrichissant l\'expérience. C\'est une occasion de compren', 'https://www.parczoologiquedeparis.fr/sites/parczoologiquedeparis/files/thumbnails/image/fg4_2617_c_f-g_grandin_mnhn_1440x850.jpg'),
(3, 'Visite du zoo en train', 'La visite du zoo Arcadia en train permet de découvrir les différents habitats de manière confortable et panoramique. Ce trajet pittoresque offre des vues imprenables sur les animaux et leur environnement. C\'est une façon amusante et relaxante d\'explorer l', 'https://www.cerza.com/wp-content/uploads/2021/03/Safari-train-2-1.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `username` varchar(50) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`username`, `nom`, `password`, `prenom`, `role_id`) VALUES
('admin@arcadia.com', 'Allouche', 'azert123', 'Riad', 1),
('employé1@arcadia.com', 'Masson', 'azert456', 'Hugo', 2),
('veto@arcadia.com', 'Serge', 'azert789', 'Kevin', 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `alimentation`
--
ALTER TABLE `alimentation`
  ADD PRIMARY KEY (`alimentation_id`);

--
-- Index pour la table `animal`
--
ALTER TABLE `animal`
  ADD PRIMARY KEY (`animal_id`),
  ADD KEY `habitat_id` (`habitat_id`),
  ADD KEY `alimentation_id` (`alimentation_id`);

--
-- Index pour la table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`avis_id`);

--
-- Index pour la table `habitat`
--
ALTER TABLE `habitat`
  ADD PRIMARY KEY (`habitat_id`);

--
-- Index pour la table `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `race_id` (`race_id`);

--
-- Index pour la table `rapport_veterinaire`
--
ALTER TABLE `rapport_veterinaire`
  ADD PRIMARY KEY (`rapport_veterinaire_id`),
  ADD KEY `animal_id` (`animal_id`),
  ADD KEY `alimentation_id` (`alimentation_id`);

--
-- Index pour la table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`service_id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `alimentation`
--
ALTER TABLE `alimentation`
  MODIFY `alimentation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `animal`
--
ALTER TABLE `animal`
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `habitat`
--
ALTER TABLE `habitat`
  MODIFY `habitat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `image`
--
ALTER TABLE `image`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `rapport_veterinaire`
--
ALTER TABLE `rapport_veterinaire`
  MODIFY `rapport_veterinaire_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `service`
--
ALTER TABLE `service`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
