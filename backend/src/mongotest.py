import mongodb

Connection = mongodb.mongo_connection()
newUser ={
        "name": "david",       
        "email": "dummmy@aa.03",
        "username": "new3",
        "password": "hashedPassword",
        "address": {
            "street":"1111 Yonge St.",
            "city":"Toronto",
            "province":"Ontario",
            "postal":"M2A 0K1"
        }
}
mongodb.insert_user(Connection, newUser)