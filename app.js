const express = require("express");
const mysql = require('mysql');
const myConnection = require('express-myconnection'); 
const nodemailer = require('nodemailer');

 const optionEcf = {
    host :'localhost',
    user : 'root',
    password : '',
    port : 3306,
    database : 'ecf-new'
 };

const app = express()

const bodyParser = require('body-parser')

app.set("views","./views");
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"));


//Définition du middleware pour connexion avec la BD
app.use(myConnection(mysql,optionEcf,'pool'));



app.get("/",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query('SELECT * FROM avis WHERE `validation` = 1;', [], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log(resultat);
                    res.render('accueil',{resultat})
                }
            })
        }
    })

})

app.get("/service",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query('SELECT * FROM service',[],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log(resultat);
                    res.render('service',{resultat})
                }  
            })
        }
    }) 
})

app.get("/habitat",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT image.image_id, image.image_animal, image.animal_id, animal.prenom, animal.etat, animal.habitat_id, animal.alimentation_id, animal.abel, habitat.nom AS nom, habitat.description AS description, habitat.commentaire_habitat, habitat.image_habitat, habitat.besoin_amelioration, habitat.etat_habitat, alimentation.nourriture, alimentation.date, alimentation.heure, alimentation.quantite FROM image LEFT JOIN animal ON image.animal_id = animal.animal_id LEFT JOIN habitat ON animal.habitat_id = habitat.habitat_id LEFT JOIN alimentation ON animal.alimentation_id = alimentation.alimentation_id;`, [], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    const habitats = resultat.reduce((acc, habitat) => {
                        const existingHabitat = acc.find((h) => h.habitat_id === habitat.habitat_id);
                        if (existingHabitat) {
                          existingHabitat.animaux.push({
                            image_id: habitat.image_id,
                            image_animal: habitat.image_animal,
                            animal_id: habitat.animal_id,
                            abel: habitat.abel,
                            prenom: habitat.prenom,
                            etat: habitat.etat,
                            nourriture: habitat.nourriture,
                            date: habitat.date,
                            heure: habitat.heure,
                            quantite: habitat.quantite
                          });
                        } else {
                          acc.push({
                            habitat_id: habitat.habitat_id,
                            nom: habitat.nom,
                            description: habitat.description,
                            commentaire_habitat: habitat.commentaire_habitat,
                            image_habitat: habitat.image_habitat,
                            besoin_amelioration: habitat.besoin_amelioration,
                            etat_habitat: habitat.etat_habitat,
                            animaux: [{
                              image_id: habitat.image_id,
                              image_animal: habitat.image_animal,
                              animal_id: habitat.animal_id,
                              abel: habitat.abel,
                              prenom: habitat.prenom,
                              etat: habitat.etat,
                              nourriture: habitat.nourriture,
                              date: habitat.date,
                              heure: habitat.heure,
                              quantite: habitat.quantite
                            }]
                          });
                        }
                        return acc;
                      }, []);
                      console.log(habitats);
                    res.render('habitat',{habitats})
                }
            })
        }
    })
    
})

app.get("/contact",(req,res) => {
    res.render('contact')
})

app.post("/contact",(req,res) => {
    console.log(req.body)
    let transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'apikey', // C'est toujours 'apikey' pour SendGrid
            pass: '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'
        }
    });
    let mailOptions = {
        from: 'zooarcadia303@gmail.com',
        to: req.body.email,
        subject: req.body.titre,
        text: `Nous avons bien reçu votre message: "${req.body.message}"`
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        return console.log(error);
        }
        console.log('Email envoyé: ' + info.response);
        });
    res.redirect('/contact');
})

app.get("/connexion",(req,res) => {
    res.render('connexion')
})
 
app.post("/connexion",(req,res) =>{
    console.log("Requête POST reçue sur /connexion");
    console.log(req.body)

    const username = req.body.username;
    const password = req.body.password;

        // Construction de la requête SQL avec des paramètres préparés
        const sql = `SELECT * FROM utilisateur JOIN role ON utilisateur.role_id = role.role_id WHERE username = ? AND password = ? ORDER BY utilisateur.role_id;`
        // Exécution de la requête SQL avec les valeurs des paramètres préparés
        req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur lors de la connexion à la base de données :", erreur);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(sql, [username, password], (erreur, resultats) => {
                if (erreur) {
                    console.log("Erreur lors de l'exécution de la requête :", erreur);
                    res.status(500).send("Une erreur s'est produite lors de l'exécution de la requête.");
                } else {
                    // Vérification si un utilisateur correspondant a été trouvé
                    console.log("résultats",resultats);
                    if (resultats.length > 0) {
                        const utilisateur = resultats[0]; // Supposons que l'utilisateur est le premier résultat
                        console.log("chercher",utilisateur.username);
                        if (utilisateur.role_id === 1) {
                            res.redirect('/admin/user');
                        } else if (utilisateur.role_id === 2) {
                            res.redirect('/employe/seremp');
                        } else if (utilisateur.role_id === 3) {
                            res.redirect('/veterinaire/vetohabi');
                        }
                    } else {
                        // Aucun utilisateur correspondant trouvé, envoyer un message d'erreur
                        res.status(401).send('Nom d\'utilisateur ou mot de passe incorrect.');
                    }
                    
                }
            });
        }
    });
});

 

// routes vers la liste admin

// gestion des utilisateur coté administrateur

app.get("/admin/user",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT * FROM utilisateur JOIN role ON utilisateur.role_id = role.role_id ORDER BY utilisateur.role_id`,[],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    // console.log(resultat);
                    const newResultat =  resultat.map(res =>{ if(res.role_id !== 1) {return res } }).filter(arr => arr !== undefined);
                    //  console.log('newResultat',newResultat);
                    res.render('admin/user',{newResultat})
                }  
            })
        }
    })   
})
app.post("/admin/user/change/:username", (req, res) => {
    // Récupération des données du formulaire
    const { username, password, label } = req.body;
    // Récupération du nom d'utilisateur à mettre à jour à partir des paramètres de l'URL
    const usernameId = req.params.username;

    // Connexion à la base de données
    req.getConnection((error, connection) => {
        if (error) {
            console.log(error);
            // Gestion de l'erreur de connexion à la base de données
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            // Exécution de la requête SQL pour mettre à jour l'utilisateur
            connection.query(
                `SELECT role_id FROM role WHERE label = ?`,
                [label],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        // Gestion de l'erreur lors de l'exécution de la requête SQL
                        res.status(500).send("Une erreur s'est produite lors de la récupération du rôle.");
                    } else if (result.length === 0) {
                        res.status(400).send("Le rôle spécifié n'existe pas.");
                    } else {
                        const roleId = result[0].role_id;
                        // Exécution de la requête SQL pour mettre à jour l'utilisateur avec le bon role_id
                        connection.query(
                            `UPDATE utilisateur SET username = ?, password = ?, role_id = ? WHERE username = ?`,
                            [username, password, roleId, usernameId],
                            (error, result) => {
                                if (error) {
                                    console.log(error);
                                    // Gestion de l'erreur lors de l'exécution de la requête SQL
                                    res.status(500).send("Une erreur s'est produite lors de la mise à jour de l'utilisateur.");
                                } else {
                                    // Redirection vers une page de confirmation ou une liste d'utilisateurs
                                    res.redirect('/admin/user');
                                }
                            }
                        );
                    }
                }
            );
        }
    });
});
app.post("/admin/user/delete/:username",(req,res) =>{
    const username= req.params.username;

    // Construction de la requête SQL de suppression
    const sql = "DELETE FROM utilisateur WHERE username = ?";

    // Exécution de la requête SQL avec les valeurs des paramètres préparés
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log("Erreur lors de la connexion à la base de données :", erreur);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            // Exécuter la requête de suppression
            connection.query(sql, [username], (erreur, resultats) => {
                if (erreur) {
                    console.log("Erreur lors de l'exécution de la requête de suppression :", erreur);
                    res.status(500).send("Une erreur s'est produite lors de la suppression de l'utilisateur.");
                } else {
                    console.log("Utilisateur supprimé avec succès !");
                    res.redirect("/admin/user");
                }
            });
        }
    });
});
app.post("/admin/user/add",(req,res) =>{
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const newRole = req.body.label;
   
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT * FROM role WHERE label = ?`, [newRole], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log(resultat[0].role_id)
                    connection.query(`INSERT INTO utilisateur (username, password, nom, prenom, role_id) VALUES (?, ?, ?, ?, ?)`,[username, password, nom, prenom, resultat[0].role_id],(erreur, resultat2)=>{
                        if(erreur){
                            console.log(erreur);
                        }else{
                            res.redirect('/admin/user');
                        }
                    })
                }
            })
         }
      })  
})

// gestion des services coté administrateur

app.get("/admin/service",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT * FROM service;`,[],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.render('admin/service',{resultat})
                }  
            })
        }
    })   
})
app.post("/admin/service/add",(req,res) =>{
    const nom = req.body.nom;
    const description = req.body.description;
    const image = req.body.image_service;
    console.log(req.body);

     req.getConnection((erreur, connection) =>{
        if(erreur){
            console.log(erreur)
        }else{
            connection.query(`INSERT INTO service (nom, description, image_service) VALUES (?, ?, ?)`,[nom, description, image],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.redirect('/admin/service')
                }
            })
        }
     })
})
app.post("/admin/service/change/:service_id",(req,res) =>{
    console.log(req.body);
    const serviceId = req.params.service_id;
    const nom = req.body.nom;
    const description = req.body.description;
    const image= req.body.image_service;
     // Connexion à la base de données
     req.getConnection((error, connection) => {
        if (error) {
            console.log(error);
            // Gestion de l'erreur de connexion à la base de données
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            // Exécution de la requête SQL pour mettre à jour le service
            connection.query(
                `UPDATE service SET nom = ?, description = ?, image_service = ? WHERE service_id = ?`,
                [nom, description, image, serviceId],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        // Gestion de l'erreur lors de l'exécution de la requête SQL
                        res.status(500).send("Une erreur s'est produite lors de la modification du service.");
                    } else {
                        // Redirection vers une page de confirmation ou une liste de services
                        res.redirect('/admin/service');
                    }
                }
            );
        }
    });
})
app.post("/admin/service/delete/:service_id",(req,res) =>{
     const serviceId = req.params.service_id;

    req.getConnection((error, connection) => {
        if (error) {
            console.log(error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(`DELETE FROM service WHERE service_id = ?`, [serviceId], (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("Une erreur s'est produite lors de la suppression du service.");
                } else {
                    console.log("Service supprimé avec succès !");
                    // Redirigez l'utilisateur vers une autre page après la suppression
                    res.redirect('/admin/service');
                }
            });
        }
    })
})

//  gestion des horaire coté administratuer

app.get("/admin/horaire",(req,res) => {
    res.render('admin/horaire')
})

// gestion des habitat coté administrateur

app.get("/admin/habitat",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT * FROM habitat;`,[],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log(resultat);
                    res.render('admin/habitat',{resultat})
                }  
            })
        }
    })      
})
app.post("/admin/habitat/add", (req, res) => {
    const { nom, description, commentaire_habitat, etat_habitat, besoin_amelioration, image_habitat } = req.body;

    // Requête SQL pour insérer un nouvel habitat
    const sql = "INSERT INTO habitat (nom, description, commentaire_habitat, etat_habitat, besoin_amelioration, image_habitat) VALUES (?, ?, ?, ?, ?, ?)";

    // Exécuter la requête SQL avec les valeurs des paramètres préparés
    req.getConnection((error, connection) => {
        if (error) {
            console.log("Erreur lors de la connexion à la base de données :", error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(sql, [nom, description, commentaire_habitat, etat_habitat,besoin_amelioration, image_habitat], (error, results) => {
                if (error) {
                    console.log("Erreur lors de l'exécution de la requête :", error);
                    res.status(500).send("Une erreur s'est produite lors de l'exécution de la requête.");
                } else {
                    console.log("Nouvel habitat ajouté avec succès !");
                    res.redirect("/admin/habitat");
                }
            });
        }
    });
}); 
app.post("/admin/habitat/change/:habitat_id", (req, res) => {
    const habitatId = req.params.habitat_id;
    const { nom, description, commentaire_habitat, etat_habitat, besoin_amelioration, image_habitat } = req.body;

    // Requête SQL pour mettre à jour les informations de l'habitat
    const sql = "UPDATE habitat SET nom = ?, description = ?, commentaire_habitat = ?, etat_habitat = ?, besoin_amelioration = ?, image_habitat = ? WHERE habitat_id = ?";

    // Exécuter la requête SQL avec les valeurs des paramètres préparés
    req.getConnection((error, connection) => {
        if (error) {
            console.log("Erreur lors de la connexion à la base de données :", error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(sql, [nom, description, commentaire_habitat, etat_habitat, besoin_amelioration, image_habitat, habitatId], (error, results) => {
                if (error) {
                    console.log("Erreur lors de l'exécution de la requête :", error);
                    res.status(500).send("Une erreur s'est produite lors de l'exécution de la requête.");
                } else {
                    console.log("Habitat modifié avec succès !");
                    res.redirect("/admin/habitat");
                }
            });
        }
    });
})
app.post("/admin/habitat/delete/:habitat_id", (req, res) => {
    const habitatId = req.params.habitat_id;

    // Requête SQL pour supprimer l'habitat
    const sql = "DELETE FROM habitat WHERE habitat_id = ?";

    // Exécuter la requête SQL avec l'identifiant de l'habitat à supprimer
    req.getConnection((error, connection) => {
        if (error) {
            console.log("Erreur lors de la connexion à la base de données :", error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(sql, [habitatId], (error, results) => {
                if (error) {
                    console.log("Erreur lors de l'exécution de la requête :", error);
                    res.status(500).send("Une erreur s'est produite lors de l'exécution de la requête.");
                } else {
                    console.log("Habitat supprimé avec succès !");
                    res.redirect("/admin/habitat");
                }
            });
        }
    });
})


// gestion des animaux coté administrateur


app.get("/admin/animaux",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT animal.animal_id, animal.prenom, animal.abel, animal.etat, habitat.nom AS nom, animal.habitat_id, animal.alimentation_id FROM animal LEFT JOIN habitat ON animal.habitat_id = habitat.habitat_id;`,[],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log(resultat);
                    res.render('admin/animaux',{resultat})
                }  
            })
        }
    })     
});
app.post("/admin/animaux/add",(req,res) =>{
    const prenom = req.body.prenom;
    const etat = req.body.etat;
    const abel = req.body.abel;
    const newHabitat = req.body.habitat; 

 req.getConnection((erreur, connection)=>{
     if(erreur){
         console.log(erreur);
     }else{
         connection.query(`SELECT * FROM habitat WHERE nom = ?`, [newHabitat], (erreur, resultat)=>{
             if(erreur){
                 console.log(erreur);
             }else{
                 console.log(resultat[0].habitat_id)
                 connection.query(`INSERT INTO animal (prenom, etat, abel, habitat_id) VALUES (?, ?, ?, ?);`,[prenom, etat, abel, resultat[0].habitat_id],(erreur, resultat2)=>{
                     if(erreur){
                         console.log(erreur);
                     }else{
                         res.redirect('/admin/animaux');
                     }
                 })
             }
         })
      }
   })  
})
app.post("/admin/animaux/change/:animal_id",(req,res) =>{
    const prenom = req.body.prenom;
    const etat = req.body.etat;
    const abel = req.body.abel;
    const newHabitat = req.body.habitat;
    
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(`SELECT * FROM habitat WHERE nom = ?`, [newHabitat], (erreur, resultat) => {
                if (erreur) {
                    console.log(erreur);
                    res.status(500).send("Une erreur s'est produite lors de la récupération de l'identifiant de l'habitat.");
                } else {
                    if (resultat.length === 0) {
                        console.log("Aucun habitat trouvé avec ce nom :", newHabitat);
                        res.status(404).send("Aucun habitat trouvé avec ce nom.");
                    } else {
                        console.log(resultat[0].habitat_id);
                        connection.query(`UPDATE animal SET prenom = ?, etat = ?, abel = ?, habitat_id = ? WHERE animal_id = ?`, [prenom, etat, abel, resultat[0].habitat_id, req.params.animal_id], (erreur, resultat2) => {
                            if (erreur) {
                                console.log(erreur);
                                res.status(500).send("Une erreur s'est produite lors de la modification de l'animal.");
                            } else {
                                console.log("Animal modifié avec succès !");
                                res.redirect('/admin/animaux');
                            }
                        });
                    }
                }
            });
        }
    });    
})
app.post("/admin/animaux/delete/:animal_id", (req, res) => {
      // Récupérer l'ID de l'animal à supprimer depuis les paramètres de l'URL
      const animalId = req.params.animal_id;
      // Requête SQL pour supprimer l'animal en fonction de son ID
      const sql = "DELETE FROM animal WHERE animal_id = ?";
  
      // Exécuter la requête SQL avec l'ID de l'animal à supprimer
      req.getConnection((error, connection) => {
          if (error) {
              console.log("Erreur lors de la connexion à la base de données :", error);
              res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
          } else {
              connection.query(sql, [animalId], (error, results) => {
                  if (error) {
                      console.log("Erreur lors de l'exécution de la requête :", error);
                      res.status(500).send("Une erreur s'est produite lors de l'exécution de la requête.");
                  } else {
                      console.log("Animal supprimé avec succès !");
                      res.redirect("/admin/animaux");
                  }
            });
         }
    });

})



// gestion des services coté employé

app.get("/employe/seremp",(req,res) =>{
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT * FROM service;`,[],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.render('employe/seremp',{resultat})
                }  
            })
        }
    })   
})
app.post("/employe/seremp/add/",(req,res) => {
    const nom = req.body.nom;
    const description = req.body.description;
    const image = req.body.image_service;

    console.log(req.body);
     req.getConnection((erreur, connection) =>{
        if(erreur){
            console.log(erreur)
        }else{
            connection.query(`INSERT INTO service (nom, description, image_service) VALUES (?, ?, ?)`,[nom, description, image],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.redirect('/employe/seremp')
                }
            })
        }
     })
})
app.post("/employe/seremp/change/:service_id",(req,res) => {
    console.log(req.body);
  const serviceId = req.params.service_id;
  const nom = req.body.nom;
  const description = req.body.description;
  const image= req.body.image_service;
   // Connexion à la base de données
   req.getConnection((error, connection) => {
      if (error) {
          console.log(error);
          // Gestion de l'erreur de connexion à la base de données
          res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
      } else {
          // Exécution de la requête SQL pour mettre à jour le service
          connection.query(
              `UPDATE service SET nom = ?, description = ?, image_service = ? WHERE service_id = ?`,
              [nom, description, image, serviceId],
              (error, result) => {
                  if (error) {
                      console.log(error);
                      // Gestion de l'erreur lors de l'exécution de la requête SQL
                      res.status(500).send("Une erreur s'est produite lors de la modification du service.");
                  } else {
                      // Redirection vers une page de confirmation ou une liste de services
                      res.redirect('/employe/seremp');
                  }
              }
          );
      }
  });
})
app.post("/employe/seremp/delete/:service_id",(req,res) => {
    const serviceId = req.params.service_id;
    req.getConnection((error, connection) => {
        if (error) {
            console.log(error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(`DELETE FROM service WHERE service_id = ?`, [serviceId], (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).send("Une erreur s'est produite lors de la suppression du service.");
                } else {
                    console.log("Service supprimé avec succès !");
                    // Redirigez l'utilisateur vers une autre page après la suppression
                    res.redirect('/employe/seremp');
                }
            });
        }
    })
})

// gestion de l'alimentation du zoo coté employé

app.get("/employe/alimentation", (req, res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT 
            animal.animal_id, 
            animal.prenom, 
            animal.abel, 
            animal.etat, 
            alimentation.date, 
            alimentation.heure, 
            alimentation.nourriture, 
            alimentation.quantite 
        FROM 
            animal 
        LEFT JOIN 
            alimentation ON animal.alimentation_id = alimentation.alimentation_id;
        `, [], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log('alimmm',resultat);
                    res.render('./employe/alimentation',{resultat})
                }
            })
        }
    })
})
app.post("/employe/alimentation/add",(req, res) => {
    const abel = req.body.abel;
    const date = req.body.date;
    const heure = req.body.heure;
    const nourriture = req.body.nourriture;
    const quantite = req.body.quantite;
      
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            // Insérez d'abord les détails de l'alimentation dans la table alimentation
            connection.query(`INSERT INTO alimentation (date, heure, nourriture, quantite) VALUES (?, ?, ?, ?)`, [date, heure, nourriture, quantite], (erreur, resultat) => {
                if (erreur) {
                    console.log(erreur);
                } else {
                    // Ensuite, récupérez l'ID de l'alimentation nouvellement insérée
                    const alimentationId = resultat.insertId;
                    // Enfin, insérez l'ID de l'alimentation dans la table animal
                    connection.query(`INSERT INTO animal (alimentation_id) VALUES (?)`, [alimentationId], (erreur, resultat) => {
                        if (erreur) {
                            console.log(erreur);
                        } else {
                            console.log("Alimentation ajoutée avec succès dans la table animal !");
                            res.redirect('/employe/alimentation');
                        }
                    });
                }
            });
        }
    });
    
})
app.post("/employe/alimentation/change/:animal_id",(req, res) => {
    const date = req.body.date;
    const heure = req.body.heure;
    const nourriture = req.body.nourriture;
    const quantite = req.body.quantite;
    const animalId = req.params.animal_id;

    const sqlUpdateAlimentation = `
        UPDATE animal
        JOIN alimentation ON animal.alimentation_id = alimentation.alimentation_id
        SET 
            alimentation.date = ?,
            alimentation.heure = ?,
            alimentation.nourriture = ?,
            alimentation.quantite = ?
        WHERE 
            animal.animal_id = ?;
    `;

    req.getConnection((error, connection) => {
        if (error) {
            console.log("Erreur lors de la connexion à la base de données :", error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(sqlUpdateAlimentation, [date, heure, nourriture, quantite, animalId], (error, results) => {
                if (error) {
                    console.log("Erreur lors de la modification de l'alimentation :", error);
                    res.status(500).send("Une erreur s'est produite lors de la modification de l'alimentation.");
                } else {
                    console.log("Alimentation mise à jour avec succès !");
                    res.redirect('/employe/alimentation');
                }
            });
        }
    });
})


// gestion des avis coté employé

app.get("/employe/avis",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query('SELECT * FROM avis;', [], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log(' avis cli',resultat);
                    res.render('./employe/avis',{resultat})
                }
            })
        }
    })

})
app.post("/employe/avis/:avis_id/validation/:validation",(req,res) => {
    const validation = req.params.validation === "1" ? 1 : null;
    const avisId = req.params.avis_id;
    console.log(req.params);
      // Connexion à la base de données
    req.getConnection((error, connection) => {
       if (error) {
           console.log(error);
           // Gestion de l'erreur de connexion à la base de données
           res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
       } else {
           // Exécution de la requête SQL pour mettre à jour l'avis
           connection.query(`UPDATE AVIS SET  validation = ? WHERE avis_id = ?;`,
               [validation, avisId],
               (error, result) => {
                   if (error) {
                       console.log(error);
                       // Gestion de l'erreur lors de l'exécution de la requête SQL
                       res.status(500).send("Une erreur s'est produite lors de la modification du service.");
                   } else {
                       // Redirection vers une page de confirmation ou une liste de avis
                       res.redirect('/employe/avis');
                   }
               }
           );
       }
   })
})
app.post("/comment",(req,res)=>{
    let commentaire = req.body.commentaire;
    let pseudo = req.body.pseudo;
    
    req.getConnection((erreur, connection)=>{
     if(erreur){
         console.log(erreur);
     }else{
         connection.query(`INSERT INTO avis(commentaire,pseudo) VALUES(?,?);`, [commentaire,pseudo], (erreur, resultat)=>{
             if(erreur){
                 console.log(erreur);
             }else{
                 res.redirect('/');
             }
         })
      }
   })
})



// routes vers la liste veterinaire

// gestion de l'habitat du zoo coté veterinaire

app.get("/veterinaire/vetohabi",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT * FROM habitat;`,[],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log(resultat);
                    res.render('veterinaire/vetohabi',{resultat})
                }  
            })
        }
    })      
    
})
app.post("/veterinaire/vetohabi/add",(req,res) => {
    const { nom, commentaire_habitat, etat_habitat, besoin_amelioration } = req.body;
    // Requête SQL pour insérer un nouvel habitat
    const sql = "INSERT INTO habitat (nom, commentaire_habitat, etat_habitat, besoin_amelioration) VALUES (?, ?, ?, ?)";
    // Exécuter la requête SQL avec les valeurs des paramètres préparés
    req.getConnection((error, connection) => {
        if (error) {
            console.log("Erreur lors de la connexion à la base de données :", error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(sql, [nom, commentaire_habitat, etat_habitat, besoin_amelioration], (error, results) => {
                if (error) {
                    console.log("Erreur lors de l'exécution de la requête :", error);
                    res.status(500).send("Une erreur s'est produite lors de l'exécution de la requête.");
                } else {
                    console.log("Nouvel habitat ajouté avec succès !");
                    res.redirect("/veterinaire/vetohabi");
                }
            });
        }
    });

})
app.post("/veterinaire/vetohabi/change/:habitat_id", (req, res) => {
    const habitatId = req.params.habitat_id;
    const { nom, commentaire_habitat, etat_habitat, besoin_amelioration } = req.body;
    console.log(req.body);
    // Requête SQL pour mettre à jour les informations de l'habitat
    const sql = "UPDATE habitat SET nom = ?, commentaire_habitat = ?, etat_habitat = ?, besoin_amelioration = ? WHERE habitat_id = ?";
    // Exécuter la requête SQL avec les valeurs des paramètres préparés
    req.getConnection((error, connection) => {
        if (error) {
            console.log("Erreur lors de la connexion à la base de données :", error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(sql, [nom, commentaire_habitat, etat_habitat, besoin_amelioration, habitatId], (error, results) => {
                if (error) {
                    console.log("Erreur lors de l'exécution de la requête :", error);
                    res.status(500).send("Une erreur s'est produite lors de l'exécution de la requête.");
                } else {
                    console.log("Habitat modifié avec succès !");
                    res.redirect("/veterinaire/vetohabi");
                }
            });
        }
    });
}) 
app.post("/veterinaire/vetohabi/delete/:habitat_id",(req,res) =>{
    const habitatId = req.params.habitat_id;
 // Requête SQL pour supprimer l'habitat
 const sql = "DELETE FROM habitat WHERE habitat_id = ?";
 // Exécuter la requête SQL avec l'identifiant de l'habitat à supprimer
 req.getConnection((error, connection) => {
     if (error) {
         console.log("Erreur lors de la connexion à la base de données :", error);
         res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
     } else {
         connection.query(sql, [habitatId], (error, results) => {
             if (error) {
                 console.log("Erreur lors de l'exécution de la requête :", error);
                 res.status(500).send("Une erreur s'est produite lors de l'exécution de la requête.");
             } else {
                 console.log("Habitat supprimé avec succès !");
                 res.redirect("/veterinaire/vetohabi");
             }
         });
     }
 });
})



// gestion de l'etet de l'abitat du zoo coté employé

app.get("/veterinaire/vetoeta",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT rapport_veterinaire.rapport_veterinaire_id, rapport_veterinaire.crveto, animal.abel, animal.etat, alimentation.nourriture, alimentation.date, alimentation.heure, alimentation.quantite, habitat.nom FROM rapport_veterinaire JOIN animal ON rapport_veterinaire.animal_id = animal.animal_id JOIN alimentation ON rapport_veterinaire.alimentation_id = alimentation.alimentation_id JOIN habitat ON animal.habitat_id = habitat.habitat_id;`,[],(erreur,resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    res.render('veterinaire/vetoeta',{resultat})
                }  
            })
        }
    })         
})
app.post("/veterinaire/vetoeta/change/:rapport_veterinaire_id", (req, res) => {
    const rapport_veterinaire_id = req.params.rapport_veterinaire_id;
    const date = req.body.date;
    const heure = req.body.heure;
    const nourriture = req.body.nourriture;
    const quantite = req.body.quantite;
    const etat = req.body.etat;
    const crveto = req.body.crveto;
    console.log(crveto);
    const sqlUpdateRapportVeterinaire = `
        UPDATE rapport_veterinaire
        JOIN animal ON rapport_veterinaire.animal_id = animal.animal_id
        JOIN alimentation ON rapport_veterinaire.alimentation_id = alimentation.alimentation_id
        SET 
            rapport_veterinaire.crveto = ?,
            animal.etat = ?,
            alimentation.date = ?,
            alimentation.heure = ?,
            alimentation.nourriture = ?,
            alimentation.quantite = ?
        WHERE 
            rapport_veterinaire.rapport_veterinaire_id = ?;
    `;

    req.getConnection((error, connection) => {
        if (error) {
            console.log("Erreur lors de la connexion à la base de données :", error);
            res.status(500).send("Une erreur s'est produite lors de la connexion à la base de données.");
        } else {
            connection.query(sqlUpdateRapportVeterinaire, [crveto, etat, date, heure, nourriture, quantite, rapport_veterinaire_id], (error, results) => {
                if (error) {
                    console.log("Erreur lors de la modification du rapport vétérinaire :", error);
                    res.status(500).send("Une erreur s'est produite lors de la modification du rapport vétérinaire.");
                } else {
                    console.log("Données mises à jour avec succès !");
                    res.redirect('/veterinaire/vetoeta');
                }
            });
        }
    });
});


// gestion de l'alimentation du zoo coté vétérinaire

app.get("/veterinaire/vetoalim",(req,res) => {
    req.getConnection((erreur, connection)=>{
        if(erreur){
            console.log(erreur);
        }else{
            connection.query(`SELECT 
            animal.animal_id, 
            animal.prenom, 
            animal.abel, 
            animal.etat, 
            alimentation.date, 
            alimentation.heure, 
            alimentation.nourriture, 
            alimentation.quantite 
        FROM 
            animal 
        LEFT JOIN 
            alimentation ON animal.alimentation_id = alimentation.alimentation_id;
        `, [], (erreur, resultat)=>{
                if(erreur){
                    console.log(erreur);
                }else{
                    console.log('alimmm',resultat);
                    res.render('./veterinaire/vetoalim',{resultat})
                }
            })
        }
    })
})




app.listen(5500,()=>{
    console.log("Serveur en écoute...")
})