module.exports = {

    checkExistsEmail:  (email) => {
        return new Promise((resolve, reject) => {
            conn.query('select * from tblUsers where email = "' + email + '"', (err, rows, fields) => {
                if(rows.length === 1){
                    reject('Email is already used.')
                }
                else{
                    resolve(rows[0]);
                }
            })
        })
    },
    checkExistsUsername:  (username) => {
        return new Promise((resolve, reject) => {
            conn.query('select * from tblUsers where username = "' + username + '"', (err, rows, fields) => {
            if(rows.length === 1){
                reject('Username already exists.')
            }
            else{
                resolve(rows[0]);
            }
        })
    })
},

    checkExistsPhoneNumber:  (phoneNumber) => {
        return new Promise((resolve, reject) => {
            conn.query('select * from tblUsers where phoneNumber = "' + phoneNumber + '"', (err, rows, fields) => {
                if(rows.length === 1){
                    reject('Phone number is already used.')
                }
                else{
                    resolve(rows[0]);
                }
            })
        })
    }
}
