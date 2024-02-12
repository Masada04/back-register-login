const bcrypt = require('bcryptjs')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

const password = bcrypt.hashSync('123456')
const userData = [
  {firstName : 'andy', lastName : 'wong', username : 'andy1', password, phone : '0987654321', email: 'andy@ggg.mail' },
  
]



const run = async () => {
  await prisma.user.createMany({
    data : userData
  })
  
}

run()
