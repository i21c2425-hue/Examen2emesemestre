-- Base de donnees pour le projet "Gestion des Commandes et Produits"
-- ESSGAM L2 GL

CREATE DATABASE IF NOT EXISTS gestion_commandes;
USE gestion_commandes;

-- table des categories de produits (electronique, vetements, etc.)
CREATE TABLE IF NOT EXISTS categories (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    nom_categorie VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

-- les produits en vente
CREATE TABLE IF NOT EXISTS produits (
    id_produit INT AUTO_INCREMENT PRIMARY KEY,
    nom_produit VARCHAR(150) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    id_categorie INT,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categorie) REFERENCES categories(id_categorie)
);

-- les clients qui passent commande
CREATE TABLE IF NOT EXISTS clients (
    id_client INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    adresse VARCHAR(255),
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- une commande = un client + une date + un statut + un montant total
CREATE TABLE IF NOT EXISTS commandes (
    id_commande INT AUTO_INCREMENT PRIMARY KEY,
    id_client INT NOT NULL,
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('En attente', 'Validee', 'Expediee', 'Livree', 'Annulee') DEFAULT 'En attente',
    montant_total DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
);

-- le detail d'une commande : quels produits, en quelle quantite
-- (une commande peut contenir plusieurs produits, d'ou cette table a part)
CREATE TABLE IF NOT EXISTS ligne_commande (
    id_ligne INT AUTO_INCREMENT PRIMARY KEY,
    id_commande INT NOT NULL,
    id_produit INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_commande) REFERENCES commandes(id_commande) ON DELETE CASCADE,
    FOREIGN KEY (id_produit) REFERENCES produits(id_produit)
);


-- quelques donnees pour tester sans tout re-saisir a la main

INSERT INTO categories (nom_categorie, description) VALUES
('Electronique', 'Appareils electroniques et gadgets'),
('Vetements', 'Habillement homme/femme'),
('Alimentation', 'Produits alimentaires');

INSERT INTO produits (nom_produit, description, prix, stock, id_categorie) VALUES
('Smartphone X10', 'Ecran 6.5 pouces, 128Go', 350000, 20, 1),
('T-shirt Coton', 'T-shirt 100% coton, taille M', 15000, 50, 2),
('Riz local 5kg', 'Sac de riz de qualite superieure', 20000, 100, 3);

INSERT INTO clients (nom, prenom, email, telephone, adresse) VALUES
('Rakoto', 'Jean', 'jean.rakoto@mail.com', '0341234567', 'Antananarivo'),
('Rasoa', 'Marie', 'marie.rasoa@mail.com', '0347654321', 'Fianarantsoa');


-- procedure pour creer une commande vide (statut "En attente", montant a 0)
-- les lignes seront ajoutees juste apres avec sp_ajouter_ligne_commande
DELIMITER //
CREATE PROCEDURE sp_ajouter_commande (
    IN p_id_client INT
)
BEGIN
    INSERT INTO commandes (id_client, statut, montant_total)
    VALUES (p_id_client, 'En attente', 0);

    SELECT LAST_INSERT_ID() AS id_commande;
END //
DELIMITER ;

-- procedure pour ajouter un produit a une commande existante
-- elle recalcule direct le montant total de la commande et deduit le stock
DELIMITER //
CREATE PROCEDURE sp_ajouter_ligne_commande (
    IN p_id_commande INT,
    IN p_id_produit INT,
    IN p_quantite INT
)
BEGIN
    DECLARE v_prix DECIMAL(10,2);

    SELECT prix INTO v_prix FROM produits WHERE id_produit = p_id_produit;

    INSERT INTO ligne_commande (id_commande, id_produit, quantite, prix_unitaire)
    VALUES (p_id_commande, p_id_produit, p_quantite, v_prix);

    UPDATE produits SET stock = stock - p_quantite WHERE id_produit = p_id_produit;

    UPDATE commandes
    SET montant_total = (
        SELECT SUM(quantite * prix_unitaire)
        FROM ligne_commande
        WHERE id_commande = p_id_commande
    )
    WHERE id_commande = p_id_commande;
END //
DELIMITER ;

-- petit trigger de securite : on bloque l'insertion si le stock est
-- insuffisant (au cas ou on oublierait de verifier cote application)
DELIMITER //
CREATE TRIGGER trg_verif_stock
BEFORE INSERT ON ligne_commande
FOR EACH ROW
BEGIN
    DECLARE v_stock INT;

    SELECT stock INTO v_stock FROM produits WHERE id_produit = NEW.id_produit;

    IF v_stock < NEW.quantite THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuffisant pour ce produit';
    END IF;
END //
DELIMITER ;

-- vue pratique pour avoir le detail complet d'une commande en une seule requete
-- (utile pour le rapport / les stats plus tard)
CREATE OR REPLACE VIEW vue_commandes_detail AS
SELECT
    c.id_commande,
    cl.nom AS nom_client,
    cl.prenom AS prenom_client,
    p.nom_produit,
    lc.quantite,
    lc.prix_unitaire,
    (lc.quantite * lc.prix_unitaire) AS sous_total,
    c.statut,
    c.date_commande
FROM commandes c
JOIN clients cl ON c.id_client = cl.id_client
JOIN ligne_commande lc ON c.id_commande = lc.id_commande
JOIN produits p ON lc.id_produit = p.id_produit;
