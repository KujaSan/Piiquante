var passwordValidator = require('password-validator');

var passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // longueur mini de 8
.is().max(24)                                  // longueur maxi de 24
.has().uppercase()                              // doit avoir des minuscules
.has().lowercase()                              // doit avoir des majuscules
.has().digits(2)                                // au moins deux chiffres
.has().not().spaces()                           // pas d'espaces

// Verification du mot de passe
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    }
    else{
        return res.status(400).json({error: "Le mot de passe est pas assez fort :" + passwordSchema.validate('req.body.password', {list : true})})
        
        
    }
}