const User     = require('../models/UserModel');
const config   = require('../config');
const mongoose = require("../lib/database/mongoose");
const async    = require('async');
const crypto   = require('crypto');


let query = async () => {
    let remove = await User.remove({});

    let create = await async.parallel([
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Олежа',
                                    secondName: 'Чеботарев',
                                },
                                email: 'ami0504@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                            });
                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Вася',
                                    secondName: 'Чеботарев',
                                },
                                email: 'ami0505@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('1234').digest('hex'),
                                series: '',
                                token: '',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Юха',
                                    secondName: 'Спицин',
                                },
                                email: 'ami0506@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Мазда',
                                    secondName: 'Хонда',
                                },
                                email: 'ami0507@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Дмитрий',
                                    secondName: 'Белан',
                                },
                                email: 'ami0508@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                        function(callback){
                            let user = new User({
                                name: {
                                    firstName: 'Олежа',
                                    secondName: 'Рукавишников',
                                },
                                email: 'ami0509@mail.ru',
                                pass: crypto.createHash('sha256', config.user.passSecret).update('123').digest('hex'),
                                series: '',
                                token: '',
                            });

                            user.save(function(err){
                                if(err){
                                    console.log(err);
                                    throw err;
                                }
                                callback(err, user);
                            });
                        },
                    ],
                    function(err, result){
                        console.log(result);
                    });
}

query();
