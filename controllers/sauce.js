const Sauce = require('../models/sauce');
const fs = require('fs');

//CRUD des sauces //

//creation de la sauce en se basant sur le schema
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: req.protocol + "://" + req.get('host') + "/file-upload/" + req.file.filename,
        likes: 0,
        dislikes: 0,
        usersLiked : [],
        usersDisliked : [],
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'La sauce est prête'}))
    .catch(error => res.status(400).json({error}));
};

//suppression de la sauce et du fichier image correspondant
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce =>{
            const pictureName = sauce.imageUrl.split('/file-upload/')[1];
            fs.unlink('file-upload/' + pictureName, ()=>{
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce supprimée!'}))
                    .catch(error => res.status(400).json({error}));
            })
        })
        .catch(error=> res.status(400).json({error}));
    
}

//Recuperation de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

//recuperation d'une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({error}));
};

//modification de la sauce et mise a jour du fichier image en supprimant l'ancien
exports.modifySauce = (req, res, next) => {
    if(req.file){
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const oldSauceName = sauce.imageUrl.split('/file-upload/')[1];
            fs.unlink('file-upload/' + oldSauceName, () => {});
        })
        .catch(error => res.status(400).json({error}));
        
        sauceObject = JSON.parse(req.body.sauce);
        sauceObject.imageUrl = req.protocol + "://" + req.get('host') + "/file-upload/" + req.file.filename;
        
    }else{
        sauceObject =  {...req.body}
    }

    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(201).json({message: 'La sauce à été mise à jour!'}))
        .catch(error => res.status(400).json({error}));
};

//Ajout likes et dislikes//

exports.likes = (req, res, next) =>{
    switch(req.body.like){
        case 1: // Ajout d'un like et ajout de l'userId au tableau, dans le cas ou like = 1
            Sauce.updateOne({_id : req.params.id},{ $inc:{likes: 1}, $push:{usersLiked: req.body.userId}})
                .then(() => res.status(200).json({message: 'Un like à été ajouté a la sauce!'}))
                .catch(error => res.status(400).json({error}));
        break;

        case -1: //ajout d'un dislike et ajout de l'userId au tableau correspondant dans le cas ou like = -1
            Sauce.updateOne({_id : req.params.id},{ $inc:{dislikes: 1}, $push:{usersDisliked: req.body.userId}})
                .then(() => res.status(200).json({message: 'Un dislike à été ajouté a la sauce!'}))
                .catch(error => res.status(400).json({error}));
        break;

        case 0:// retrait du like/dislike et de l'userId si deja present dans le tableau
            Sauce.findOne({_id : req.params.id})
                .then((sauce) =>{
                    if(sauce.usersLiked.includes(req.body.userId)){
                        Sauce.updateOne({_id : req.params.id}, { $inc:{likes: -1}, $pull:{usersLiked: req.body.userId}})
                            .then(() => res.status(200).json({message: 'Un like à été retiré a la sauce!'}))
                            .catch(error => res.status(400).json({error}));
                    }
                    else if(sauce.usersDisliked.includes(req.body.userId)){
                        Sauce.updateOne({_id : req.params.id}, { $inc:{dislikes: -1}, $pull:{usersDisliked: req.body.userId}})
                            .then(() => res.status(200).json({message: 'Un dislike à été retiré a la sauce!'}))
                            .catch(error => res.status(400).json({error}));
                    }
                })
                .catch(error => res.status(400).json({error}));
        break;
    };
};
