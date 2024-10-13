const Post = (id, uid, username, title, desc, img, cat, date, tags, thumbnail) => {
  return {
    id,
    uid,
    username,
    title,
    desc,
    img,
    cat,
    date,
    tags,
    thumbnail
  }
}

Post.from_object = (obj) => {
  return Post(obj.id, obj.uid, obj.username, obj.title, obj.desc, obj.img, obj.cat, obj.date, obj.tags, obj.thumbnail)
}

// models posts as a sequence of Post
const Posts = (posts) => {
  return posts.map(post => Post(post.id, post.uid, post.username, post.title, post.desc, post.img, post.cat, post.date, post.tags, post.thumbnail))
}

export const postModel = {
  Post,
  Posts
}