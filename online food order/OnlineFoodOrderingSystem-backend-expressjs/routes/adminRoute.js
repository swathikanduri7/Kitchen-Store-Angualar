var express = require('express');
const flash = require('express-flash');
var router = express.Router()
var User = require('../models/user')
var Recipe = require('../models/recipe')
var Feedback = require('../models/feedback')
var Order = require('../models/order')
var multer = require('multer')
const jwt = require('jsonwebtoken')


router.get('/check', verifyToken, (req, res, next) => {
    res.json({ msg: "All ok" })
})


router.get('/getalluser', verifyToken, (req, res, next) => {
    User.find({ role: "customer" }, (err, users) => {
        if (err) {
            res.status(500).json({ errmsg: err })
        }
        res.status(200).json({ msg: users })
    })
})

// admin side block user
router.delete("/blockuser/:id", verifyToken, (req, res, next) => {
    // console.log(req.params.id);
    var id = req.params.id
    User.updateOne({ _id: id }, { blocked: true }, function (err, user) {
        console.log(1);
        if (err) {
            console.log(err)
            res.status(500).json({ errmsg: err })
        }
        else {
            console.log("Blocked user");
            return res.status(201).json(user);
        }
    })

    // res.status(200).json({ msg: "ok" })
})

// admin side unblockuser
router.delete("/unblockuser/:id", verifyToken, (req, res, next) => {
    var id = req.params.id
    // console.log(req.params.id);
    User.updateOne({ _id: id }, { blocked: false }, function (err, user) {
        console.log(1);
        if (err) {
            console.log(err)
            res.status(500).json({ errmsg: err })
        }
        else {
            console.log("unblocked user");
            return res.status(201).json(user);
        }
    })
})
// admin side delete user
router.delete("/deleteuser/:id", verifyToken, (req, res, next) => {
    var id = req.params.id
    console.log(req.params.id);
    User.deleteOne({ _id: id }, (err) => {
        if (err)
            console.log("err in delete by admin");
    })
    res.status(200).json({ msg: "yes deleted user by admin" })
})





// addrecipeimage

function getTime() {
    var today = new Date().toLocaleDateString()
    today = today.toString().replace('/', '-')
    today = today.replace('/', '-')

    const date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();

    today += '-' + h + '-' + m + '-' + s

    return today;
}
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'D:\\OnlinePizzaOrderingSystemAngular-master\\OnlinePizzaOrderingSystemAngular-master\\src\\assets\\recipe')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${getTime()}-${file.originalname}`)
    }
})
var upload = multer({ storage: storage })


// addrecipe data
router.post("/addrecipe", verifyToken, upload.single('file'), (req, res, next) => {
    var file = req.file
    var recipe = new Recipe({
        dishname: req.body.dishname,
        quantity: req.body.quantity,
        price: req.body.price,
        dishimage: file.filename
    })
    try {
        doc = recipe.save();
        console.log("Added a recipe");
        return res.status(201).json(doc);
    }
    catch (err) {
        return res.status(501).json(err);
    }
})

router.get('/getallrecipe', verifyToken, (req, res, next) => {
    Recipe.find({}, (err, recipes) => {
        if (err) {
            res.status(500).json({ errmsg: err })
        }
        res.status(200).json({ msg: recipes })
    })
})



router.delete("/deleterecipe/:id", verifyToken, (req, res, next) => {
    var id = req.params.id
    console.log(req.params.id);
    Recipe.deleteOne({ _id: id }, (err) => {
        if (err) {
            console.log("err  in recipe delete by admin");
        }
    })
    res.status(200).json({ msg: "yes deleted recipe by admin" })
})



// edit recipe with image
router.post("/editrecipewithimage", verifyToken, upload.single('file'), (req, res, next) => {
    var file = req.file
    Recipe.updateOne({ _id: req.body.id }, {
        dishname: req.body.dishname,
        quantity: req.body.quantity,
        price: req.body.price,
        dishimage: file.filename
    }, function (err, recipe) {
        console.log(1);
        if (err) {
            console.log(err)
            res.status(500).json({ errmsg: err })
        }
        else {
            console.log("Edited a recipe with image");
            return res.status(201).json(recipe);
        }
    })

})

// edit recipe without image
router.get("/editrecipewithoutimage", verifyToken, (req, res, next) => {
    Recipe.updateOne({ _id: req.query.id }, {
        dishname: req.query.dishname,
        quantity: req.query.quantity,
        price: req.query.price
    }, function (err, recipe) {

        if (err) {
            console.log(err)
            res.status(500).json({ errmsg: err })
        }
        else {
            console.log("Edited recipe without image");
            return res.status(201).json(recipe);
        }
    })
})

function verifyToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send("unauthorized req")
    }
    let token = req.headers.authorization.split(' ')[1]
    // console.log(token);
    if (token == 'null') {
        return res.status(401).send("unauthorized req")
    }
    let payload = jwt.verify(token, 'secretkey')
    if (!payload) {
        return res.status(401).send("unauthorized req")
    }
    req.userId = payload.subject
    next()
}


router.get('/getallfeedbback', verifyToken, (req, res, next) => {
    Feedback.find({}, (err, feedbacks) => {
        if (err) {
            res.status(500).json({ errmsg: err })
        }
        res.status(200).json({ msg: feedbacks })
    })
})



router.delete("/deletefeedback/:id", verifyToken, (req, res, next) => {
    var id = req.params.id
    // console.log(req.params.id);
    Feedback.deleteOne({ _id: id }, (err) => {
        if (err) {
            console.log("err in delete by admin");
            res.json({ msg: err })
        }
    })
    res.status(200).json({ msg: "yes deleted feedback by admin" })
})




router.get('/getallorder', verifyToken, (req, res, next) => {
    Order.find({}, (err, orders) => {
        if (err) {
            res.status(500).json({ errmsg: err })
        }
        res.status(200).json({ msg: orders })
    })
})

router.delete("/deleteorder/:id", verifyToken, (req, res, next) => {
    var id = req.params.id
    Order.deleteOne({ _id: id }, (err) => {
        if (err) {
            console.log("err in orderr delete by admin");
            res.json({ msg: err })
        }
    })
    res.status(200).json({ msg: "yes deleted order by admin" })
})



router.delete("/getonecartitem/:id", verifyToken, (req, res, next) => {
    var id = req.params.id
    Order.find({ _id: id }, (err, order) => {
        if (err) {
            res.status(500).json({ error: err })
        }
        res.send(order)
    })
})

router.delete("/getonecartitemuser/:id", verifyToken, (req, res, next) => {
    var id = req.params.id
    console.log("yes in backend");
    User.findOne({ _id: id }, (err, user) => {
        if (err) {
            res.status(401).json.send({error:err})
       
        }
        else
        {
            res.status(200).json({ user: user })
        }
    })
})


module.exports = router