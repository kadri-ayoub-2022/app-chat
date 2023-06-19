const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
mongoose.set('strictQuery', true)

const db_url = 'mongodb://127.0.0.1:27017/chat-app'

const User = require('./user.model').User

exports.createNewUser = (username,email,password) => {
    return new Promise((resolve,reject) => {
        mongoose.connect(db_url).then(() => {
            return User.findOne({email:email})
        }).then((user) => {
            if (user) {
                mongoose.disconnect()
                reject('email is used')
            }else {
                return bcrypt.hash(password,10)
            }
        }).then(hashedpassword => {
                    let user =new User({
                        username : username,
                        email : email,
                        password : hashedpassword
                    })
                    return user.save()
                }
        ).then(() => {
            mongoose.disconnect()
            resolve()
        }).catch( err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

exports.login = (email,password) => {
    return new Promise((resolve,reject) => {
        mongoose.connect(db_url).then(() => User.findOne({email:email})).then((user) => {
            if (!user){
                mongoose.disconnect()
                reject('there is no user match emails')
            }else {
                return bcrypt.compare(password,user.password).then((same) => {
                    if(!same) {
                        mongoose.disconnect()
                        reject('password is incorrect')
                    }else {
                        mongoose.disconnect()
                        resolve(user)
                    }
                })
            }
        }).catch( err => {
            mongoose.disconnect()
            reject(err)
        })
    })
}

