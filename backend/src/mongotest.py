import mongodb

Connection = mongodb.mongo_connection()
newUser ={
        "name": "tom",       
        "email": "dummmy@aa.04",
        "username": "tom",
        "password": "hashedPassword",
        "address": {
            "street":"111 Yonge St.",
            "city":"Toronto",
            "province":"Ontario",
            "postal":"M2A 0K4"
        }
}
mongodb.insert_user(Connection, newUser)