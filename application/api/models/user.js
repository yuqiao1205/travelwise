const User = (id, username, email, city, img, nickname, password, fullname, interest) => {
  return {
    id,
    username,
    email,
    city,
    img,
    nickname,
    password,
    fullname,
    interest
  }
}

User.fromObject = (obj) => {
  return User(obj.id, obj.username, obj.email, obj.city, obj.img, obj.nickname, obj.password, obj.fullname, obj.interest)
}

export const userModel = {
  User
}
