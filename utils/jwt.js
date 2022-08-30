const jwt = require("jsonwebtoken")

const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user })

  const oneDay = 1000 * 60 * 60 * 24 //1 sec- 1000 * 60 * 60 * 24  =1d
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  })
}

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

  return token
}

const isTokenValid = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY)
}

module.exports = {
  attachCookiesToResponse,
  createJWT,
  isTokenValid,
}
