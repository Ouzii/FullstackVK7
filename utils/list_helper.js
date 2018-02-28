const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let max = 0
    let index = 0
    for (var i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > max) {
            max = blogs[i].likes
            index = i
        }
    }
    return blogs[index]
}

const mostBlogs = (blogs) => {
    let writers = []


    for (var i = 0; i < blogs.length; i++) {
        let found = false;
        let indWrit = 0;
        for (var j = 0; j < writers.length; j++) {
            if (writers[j].author === blogs[i].author) {
                found = true;
                indWrit = j;
                break;
            }
        }

        if (!found) {
            const newWriter = {
                author: blogs[i].author,
                blogs: 1
            }
            writers.push(newWriter)
        } else {
            function updateBlogs(ele) {
                return ele.author === blogs[i].author ? {
                    author: ele.author,
                    blogs: ele.blogs + 1
                } : ele
            }
            const newWriters = writers.map(updateBlogs)
            writers = newWriters
        }
    }

    let max = 0
    let ind = 0
    for(var i = 0; i<writers.length; i++) {
        if(writers[i].blogs > max) {
            max = writers[i].blogs
            ind = i
        }
    }

    return writers[ind]
}

const mostLikes = (blogs) => {
    let writers = []
    
    
        for (var i = 0; i < blogs.length; i++) {
            let found = false;
            let indWrit = 0;
            for (var j = 0; j < writers.length; j++) {
                if (writers[j].author === blogs[i].author) {
                    found = true;
                    indWrit = j;
                    break;
                }
            }
    
            if (!found) {
                const newWriter = {
                    author: blogs[i].author,
                    likes: blogs[i].likes
                }
                writers.push(newWriter)
            } else {
                function updateBlogs(ele) {
                    return ele.author === blogs[i].author ? {
                        author: ele.author,
                        likes: ele.likes + blogs[i].likes
                    } : ele
                }
                const newWriters = writers.map(updateBlogs)
                writers = newWriters
            }
        }
    
        let max = 0
        let ind = 0
        for(var i = 0; i<writers.length; i++) {
            if(writers[i].likes > max) {
                max = writers[i].likes
                ind = i
            }
        }
    
        return writers[ind]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}